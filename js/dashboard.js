window.Dashboard = {
  render(result){
    const panel=document.getElementById('resultPanel');
    panel.classList.remove('neutral','safe-state','danger-state','analyzed');
    panel.classList.add(result.suspicious?'danger-state':'safe-state','analyzed');
    document.getElementById('statusTitle').textContent=result.suspicious?'⚠ Suspicious Activity Detected':'✓ No Suspicious Activity Detected';
    document.getElementById('riskScore').textContent=result.risk;
    document.getElementById('riskGauge').style.setProperty('--risk',result.risk);
    document.getElementById('threatLevel').textContent=result.level;
    document.getElementById('indicatorCount').textContent=result.findings.length;
    document.getElementById('lineCount').textContent=result.lines;
    document.getElementById('recommendation').textContent=result.recommendation;

    const list=document.getElementById('indicatorList');
    if(!result.findings.length) list.innerHTML='<span class="indicator safe">No known suspicious indicators</span>';
    else list.innerHTML=result.findings.map(f=>`<span class="indicator" title="${f.severity.toUpperCase()} • ${f.count} match(es)">${escapeHtml(f.label)} ×${f.count}</span>`).join('');

    const evidence=document.getElementById('evidenceList');
    const unique=result.matchedLines.slice(0,12);
    document.getElementById('matchBadge').textContent=result.matchedLines.length+' matches';
    evidence.classList.toggle('empty-state',!unique.length);
    evidence.innerHTML=unique.length?unique.map(e=>`<div class="evidence-line"><b>L${e.line}</b> • ${escapeHtml(e.rule)}<br>${escapeHtml(e.text)}</div>`).join(''):'No suspicious evidence matched.';

    const breakdown=document.getElementById('breakdown');
    const entries=Object.entries(result.categoryCounts).sort((a,b)=>b[1]-a[1]);
    breakdown.classList.toggle('empty-state',!entries.length);
    const max=Math.max(...entries.map(([,n])=>n),1);
    breakdown.innerHTML=entries.length?entries.map(([cat,n])=>`<div class="breakdown-row"><span>${escapeHtml(cat)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(10,(n/max)*100)}%"></div></div><b>${n}</b></div>`).join(''):'No threat categories detected.';
  },
  clear(){
    document.getElementById('statusTitle').textContent='Awaiting file';
    document.getElementById('riskScore').textContent='0';document.getElementById('riskGauge').style.setProperty('--risk',0);
    document.getElementById('threatLevel').textContent='—';document.getElementById('indicatorCount').textContent='0';document.getElementById('lineCount').textContent='0';
    document.getElementById('indicatorList').innerHTML='No analysis yet.';document.getElementById('recommendation').textContent='Upload a file to begin.';
    document.getElementById('evidenceList').innerHTML='Matched log lines will appear here.';document.getElementById('breakdown').innerHTML='Threat categories will appear after analysis.';document.getElementById('matchBadge').textContent='0 matches';
    document.getElementById('resultPanel').className='result-panel glass neutral';
  }
};
function escapeHtml(str){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
