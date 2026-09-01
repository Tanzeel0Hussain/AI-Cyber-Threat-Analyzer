(()=>{
  const drop=document.getElementById('dropZone'), input=document.getElementById('fileInput'), analyze=document.getElementById('analyzeBtn'), reset=document.getElementById('resetBtn');
  let selected=null;
  const choose=f=>{selected=f;document.getElementById('fileName').textContent=f.name;document.getElementById('fileSize').textContent=FileHandler.size(f.size);document.getElementById('fileMeta').classList.remove('hidden');analyze.disabled=false;};
  drop.addEventListener('click',()=>input.click()); drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ') input.click()});
  input.addEventListener('change',()=>input.files[0]&&choose(input.files[0]));
  ['dragenter','dragover'].forEach(evt=>drop.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover')}));
  ['dragleave','drop'].forEach(evt=>drop.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover')}));
  drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f) choose(f)});
  analyze.addEventListener('click',async()=>{try{analyze.disabled=true;analyze.textContent='Analyzing…';const text=await FileHandler.read(selected);const result=ThreatAnalyzer.analyze(text);Dashboard.render(result)}catch(err){alert(err.message)}finally{analyze.disabled=false;analyze.textContent='Analyze Threats'}});
  reset.addEventListener('click',()=>{selected=null;input.value='';document.getElementById('fileMeta').classList.add('hidden');analyze.disabled=true;Dashboard.clear()});
})();
