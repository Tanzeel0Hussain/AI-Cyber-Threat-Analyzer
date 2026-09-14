const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const paths = ['js/threat-rules.js','js/analyzer.js','js/file-handler.js','js/dashboard.js','js/app.js'];
const sources = Object.fromEntries(paths.map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
const samples = {normal:fs.readFileSync(path.join(root,'samples/normal_activity.log'),'utf8'),suspicious:fs.readFileSync(path.join(root,'samples/suspicious_activity.log'),'utf8')};

async function runRegressionTests(sources, samples) {
  let count = 0;
  const assert = (condition, message) => { if(!condition) throw new Error(message); count++; };
  const rejects = async (fn, pattern) => { let error; try { await fn(); } catch(e) { error = e; } assert(error && pattern.test(error.message), 'Expected rejection: ' + pattern); };
  const w = {};
  for(const path of ['js/threat-rules.js','js/analyzer.js','js/file-handler.js']) new Function('window', sources[path])(w);
  const analyze = text => w.ThreatAnalyzer.analyze(text);
  const normal = analyze(samples.normal);
  assert(normal.risk === 0 && !normal.suspicious, 'Normal sample must have no configured matches');
  const suspicious = analyze(samples.suspicious);
  assert(suspicious.risk === 100 && suspicious.level === 'CRITICAL', 'Suspicious sample expected score');
  assert(analyze('normal\n\nFailed login').matchedLines[0].line === 3, 'Blank line numbers preserved');
  assert(analyze('normal\r\n \r\nFailed login').matchedLines[0].line === 3, 'CRLF line numbers preserved');
  assert(analyze('normal\r\rFailed password').matchedLines[0].line === 3, 'CR line numbers preserved');
  assert(analyze('Failed password for invalid user demo from 192.0.2.1').findings[0].id === 'failed-login', 'SSH failures detected');
  assert(analyze('normal\n\n \n').lines === 1, 'Line metric counts nonempty entries');
  const repeated = analyze(Array(4).fill('Failed login').join('\n'));
  assert(repeated.findings.some(f=>f.id === 'repeated-auth-failures'), 'Repeated failures identified without claiming proven brute force');
  assert(repeated.matchedLines.filter(e=>e.rule.includes('file-wide')).length === 4, 'Derived finding has source evidence');
  assert(repeated.categoryCounts.Authentication === 8, 'Category counts agree with rule evidence');
  assert(!analyze('Failed login\nFailed login\nFailed login').findings.some(f=>f.id === 'repeated-auth-failures'), 'Repetition threshold');
  assert(!analyze('brute force\n'+Array(4).fill('Failed login').join('\n')).findings.some(f=>f.id === 'repeated-auth-failures'), 'Explicit brute-force rule not double boosted');
  const ordered = analyze('malware\nFailed login');
  assert(ordered.matchedLines[0].line === 1, 'Evidence in original order');
  await rejects(()=>analyze(' \n'), /No log/);
  const file = (name, text, size=text.length, type='') => ({name, size, type, text:async()=>text});
  assert(await w.FileHandler.read(file('test.LOG','hello')) === 'hello', 'Uppercase log extension');
  await rejects(()=>w.FileHandler.read(file('test.exe','hello',5,'text/plain')), /\.log/);
  await rejects(()=>w.FileHandler.read(file('test.txt.exe','hello')), /\.log/);
  await rejects(()=>w.FileHandler.read(file('test.txt','',0)), /empty/);
  await rejects(()=>w.FileHandler.read(file('test.log',' \n')), /no log entries/);
  await rejects(()=>w.FileHandler.read(file('test.log','abc\u0000xyz')), /binary/);
  await rejects(()=>w.FileHandler.read(file('test.log','x',2097153)), /2 MB/);
  assert(await w.FileHandler.read(file('test.log','x',2097152)) === 'x', 'Exactly 2 MiB accepted');
  assert(await w.FileHandler.read(file('test.txt','a\tb\r\nc')) === 'a\tb\r\nc', 'Normal text controls accepted');
  w.THREAT_RULES = [{id:'stateful',label:'Stateful',category:'Test',severity:'low',weight:1,patterns:[/hit/g]}];
  assert(analyze('hit\nhit').findings[0].count === 2, 'Regex lastIndex cannot skip lines');
  new Function('window', sources['js/threat-rules.js'])(w);

  // Small DOM adapter exercises application state, not browser layout.
  const nodes = new Map();
  const node = id => {
    if(!nodes.has(id)) {
      const classes = new Set(), listeners = {};
      const n = {id, textContent:'', innerHTML:'', disabled:false, value:'', files:[], clicks:0, listeners,
        classList:{add:(...v)=>v.forEach(x=>classes.add(x)),remove:(...v)=>v.forEach(x=>classes.delete(x)),contains:v=>classes.has(v),toggle:(v,on)=>on?classes.add(v):classes.delete(v)},
        style:{setProperty(){}}, attributes:{}, setAttribute(k,v){this.attributes[k]=v;},
        addEventListener(k,fn){listeners[k]=fn;}, click(){this.clicks++;}, scrollIntoView(){},
        closest(selector){return ['analyzeBtn','resetBtn','chooseBtn'].includes(id)&&selector.includes('button')?n:null;}
      };
      nodes.set(id,n);
    }
    return nodes.get(id);
  };
  const document = {getElementById:node};
  new Function('window','document', sources['js/dashboard.js'])(w,document);
  new Function('window','document','FileHandler','ThreatAnalyzer','Dashboard',sources['js/app.js'])(w,document,w.FileHandler,w.ThreatAnalyzer,w.Dashboard);
  const event = target => ({target, stopPropagation(){}, preventDefault(){}});
  const select = f => {node('fileInput').files=[f];node('fileInput').listeners.change();};
  const clickAnalyze = () => node('analyzeBtn').listeners.click(event(node('analyzeBtn')));
  const reset = () => node('resetBtn').listeners.click(event(node('resetBtn')));
  select(file('old.log','Failed login')); await clickAnalyze();
  assert(node('riskScore').textContent === 12, 'Valid file renders result');
  select(file('new.log','normal'));
  assert(node('riskScore').textContent === '0', 'Selecting another file clears stale result');
  select(file('bad.exe','normal'));
  assert(node('analyzeBtn').disabled, 'Invalid selection disables analysis');
  select(file('blank.log','  ')); await clickAnalyze();
  assert(node('fileStatus').textContent.includes('no log entries'), 'Read error shown inline');
  assert(node('riskScore').textContent === '0', 'Read error cannot show safe result');
  let resolveOld;
  select({name:'slow.log',size:20,text:()=>new Promise(resolve=>{resolveOld=resolve;})});
  const pending = clickAnalyze();
  reset(); resolveOld('malware'); await pending;
  assert(node('statusTitle').textContent === 'Awaiting file' && node('analyzeBtn').disabled, 'Reset cancels stale completion');
  let resolveA, resolveB;
  select({name:'a.log',size:20,text:()=>new Promise(resolve=>{resolveA=resolve;})});
  const a = clickAnalyze();
  select({name:'b.log',size:20,text:()=>new Promise(resolve=>{resolveB=resolve;})});
  const b = clickAnalyze();
  resolveA('malware'); await a;
  assert(node('analyzeBtn').disabled && node('fileStatus').textContent.includes('Reading'), 'Old finally cannot unlock current analysis');
  resolveB('normal'); await b;
  assert(node('riskScore').textContent === 0 && node('fileStatus').textContent.includes('b.log'), 'Only latest file renders');
  select(file('html.log','<img src=x onerror=alert(1)> malware')); await clickAnalyze();
  assert(!node('evidenceList').innerHTML.includes('<img') && node('evidenceList').innerHTML.includes('&lt;img'), 'Evidence escaped');
  reset();
  assert(node('evidenceList').classList.contains('empty-state') && node('breakdown').classList.contains('empty-state'), 'Reset restores empty classes');
  node('chooseBtn').listeners.click(event(node('chooseBtn')));
  assert(node('fileInput').clicks === 1, 'Choose File opens picker once');
  node('dropZone').listeners.click(event(node('analyzeBtn')));
  assert(node('fileInput').clicks === 1, 'Analyze click cannot open picker');
  node('dropZone').listeners.drop({...event(node('dropZone')),dataTransfer:{files:[file('a.log','x'),file('b.log','x')]}});
  assert(node('analyzeBtn').disabled && node('fileStatus').textContent.includes('one log'), 'Multiple-file drop rejected');
  return count;
}

runRegressionTests(sources,samples).then(count=>console.log(count + ' regression checks passed')).catch(error=>{console.error(error);process.exitCode=1;});
