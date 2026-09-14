(() => {
  const drop = document.getElementById('dropZone');
  const input = document.getElementById('fileInput');
  const analyze = document.getElementById('analyzeBtn');
  const reset = document.getElementById('resetBtn');
  const status = document.getElementById('fileStatus');
  let selected = null, revision = 0, busy = false;

  const setBusy = value => {
    busy = value;
    analyze.disabled = value || !selected;
    analyze.textContent = value ? 'Analyzing...' : 'Analyze Threats';
    document.getElementById('resultPanel').setAttribute('aria-busy', String(value));
  };
  const clearSelection = () => {
    revision++;
    selected = null;
    input.value = '';
    document.getElementById('fileMeta').classList.add('hidden');
    document.getElementById('fileName').textContent = 'None';
    document.getElementById('fileSize').textContent = '0 B';
    Dashboard.clear();
    status.textContent = '';
    setBusy(false);
  };
  const choose = file => {
    if(!file) return;
    clearSelection();
    try {
      FileHandler.validate(file);
      selected = file;
      document.getElementById('fileName').textContent = file.name;
      document.getElementById('fileSize').textContent = FileHandler.size(file.size);
      document.getElementById('fileMeta').classList.remove('hidden');
      status.textContent = 'Ready to analyze. File contents stay in this browser.';
      setBusy(false);
    } catch(error) {
      status.textContent = error.message || 'Unable to select this file.';
    }
  };
  drop.addEventListener('click', e => {
    if(e.target.closest('button, label, input, a')) return;
    input.click();
  });
  drop.addEventListener('keydown', e => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    if(e.target !== drop) return;
    e.preventDefault();
    input.click();
  });
  document.getElementById('chooseBtn').addEventListener('click', e => {
    e.stopPropagation();
    input.click();
  });
  input.addEventListener('change', () => choose(input.files && input.files[0]));
  ['dragenter','dragover'].forEach(name=>drop.addEventListener(name, e=>{
    e.preventDefault();
    drop.classList.add('dragover');
  }));
  drop.addEventListener('dragleave', e=>{
    e.preventDefault();
    drop.classList.remove('dragover');
  });
  drop.addEventListener('drop', e=>{
    e.preventDefault();
    drop.classList.remove('dragover');
    const files = e.dataTransfer && e.dataTransfer.files;
    if(files && files.length > 1){
      clearSelection();
      status.textContent = 'Choose one log file at a time.';
    } else choose(files && files[0]);
  });
  analyze.addEventListener('click', async e=>{
    e.stopPropagation();
    if(!selected || busy) return;
    const file = selected, token = revision;
    Dashboard.clear();
    setBusy(true);
    status.textContent = 'Reading and analyzing the selected log...';
    try {
      const text = await FileHandler.read(file);
      if(token !== revision) return;
      const result = ThreatAnalyzer.analyze(text);
      Dashboard.render(result);
      status.textContent = 'Analysis complete: ' + file.name;
      document.getElementById('resultPanel').scrollIntoView({behavior:'smooth', block:'start'});
    } catch(error) {
      if(token !== revision) return;
      Dashboard.clear();
      status.textContent = error.message || 'Unable to analyze the selected file.';
    } finally {
      if(token === revision) setBusy(false);
    }
  });
  reset.addEventListener('click', e=>{
    e.stopPropagation();
    clearSelection();
    status.textContent = 'Reset complete. Choose a log file.';
  });
})();
