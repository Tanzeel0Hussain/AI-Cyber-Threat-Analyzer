window.ThreatAnalyzer = {
  analyze(text){
    if(typeof text !== 'string' || !text.trim()) throw new Error('No log entries to analyze.');
    // Keep physical line positions even when blank lines are skipped.
    const lines = text.split(/\r\n|\n|\r/).map((text, index)=>({text, line:index+1})).filter(entry=>entry.text.trim());
    const findings = [], matchedLines = [], categoryCounts = {};
    let failedMatches = [];
    const addFinding = (rule, matches, score) => {
      findings.push({...rule, count:matches.length, score});
      categoryCounts[rule.category] = (categoryCounts[rule.category] || 0) + matches.length;
      matches.forEach(entry=>matchedLines.push({...entry, rule:rule.label, severity:rule.severity}));
    };
    for(const rule of window.THREAT_RULES){
      const matches = lines.filter(entry=>rule.patterns.some(re=>{
        re.lastIndex = 0;
        return re.test(entry.text);
      }));
      if(rule.id === 'failed-login') failedMatches = matches;
      if(matches.length) addFinding(rule, matches, rule.weight + Math.min((matches.length-1)*3,12));
    }
    if(failedMatches.length >= 4 && !findings.some(f=>f.id === 'brute-force')){
      // File-wide repetition is not proof of a coordinated or timed attack.
      addFinding({
        id:'repeated-auth-failures', label:'Repeated Authentication Failures (file-wide)',
        category:'Authentication', severity:'high', weight:30
      }, failedMatches, 30);
    }
    matchedLines.sort((a,b)=>a.line-b.line || a.rule.localeCompare(b.rule));
    let risk = findings.reduce((sum,f)=>sum+f.score,0);
    if(findings.some(f=>f.severity === 'critical')) risk += 10;
    if(findings.length >= 4) risk += 8;
    risk = Math.min(100,risk);
    const level = risk >= 75 ? 'CRITICAL' : risk >= 50 ? 'HIGH' : risk >= 25 ? 'MEDIUM' : risk >= 8 ? 'LOW' : 'MINIMAL';
    const suspicious = risk >= 8;
    let recommendation = 'No configured indicators matched. This does not establish that the file or system is safe.';
    if(level === 'LOW' || level === 'MEDIUM') recommendation = 'Review the matched lines in context. Confirm the account, source and timing before deciding whether these events require action.';
    if(level === 'HIGH' || level === 'CRITICAL') recommendation = 'Prioritize investigation and preserve the original logs. Confirm the indicators before choosing containment actions under your incident-response process.';
    return {lines:lines.length, findings, matchedLines, categoryCounts, risk, level, suspicious, recommendation};
  }
};
