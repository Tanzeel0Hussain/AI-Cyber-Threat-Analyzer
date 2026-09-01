window.ThreatAnalyzer = {
  analyze(text){
    const lines = text.split(/\r?\n/).filter(Boolean);
    const findings = [];
    const matchedLines = [];
    const categoryCounts = {};

    for(const rule of window.THREAT_RULES){
      const ruleMatches = [];
      lines.forEach((line,index)=>{
        if(rule.patterns.some(re=>re.test(line))){
          ruleMatches.push({line:index+1,text:line});
          matchedLines.push({line:index+1,text:line,rule:rule.label,severity:rule.severity});
        }
      });
      if(ruleMatches.length){
        const repeatBonus = Math.min((ruleMatches.length-1)*3,12);
        findings.push({...rule,count:ruleMatches.length,score:rule.weight+repeatBonus});
        categoryCounts[rule.category] = (categoryCounts[rule.category]||0)+ruleMatches.length;
      }
    }

    const failedLoginCount = lines.filter(l=>/failed login|authentication failure|invalid password|login failed/i.test(l)).length;
    if(failedLoginCount >= 4 && !findings.some(f=>f.id==='brute-force')){
      const rule = { id:'brute-force-derived',label:'Probable Brute Force Pattern',category:'Authentication',severity:'high',weight:24,count:failedLoginCount,score:30 };
      findings.push(rule); categoryCounts.Authentication=(categoryCounts.Authentication||0)+1;
    }

    let risk = findings.reduce((sum,f)=>sum+f.score,0);
    if(findings.some(f=>f.severity==='critical')) risk += 10;
    if(findings.length >= 4) risk += 8;
    risk = Math.min(100,risk);

    const level = risk >= 75 ? 'CRITICAL' : risk >= 50 ? 'HIGH' : risk >= 25 ? 'MEDIUM' : risk >= 8 ? 'LOW' : 'MINIMAL';
    const suspicious = risk >= 8;

    let recommendation = 'No known suspicious patterns were detected. Continue normal monitoring and keep security controls updated.';
    if(level==='LOW' || level==='MEDIUM') recommendation = 'Review the matched events, verify the affected account or host, and continue monitoring for repeated activity.';
    if(level==='HIGH') recommendation = 'Investigate immediately. Consider blocking the suspicious source, reviewing authentication logs, and isolating affected systems if necessary.';
    if(level==='CRITICAL') recommendation = 'Treat as a high-priority incident. Isolate affected systems, preserve logs, block malicious sources, reset exposed credentials, and begin incident-response procedures.';

    return {lines:lines.length,findings,matchedLines,categoryCounts,risk,level,suspicious,recommendation};
  }
};
