window.THREAT_RULES = [
  { id:'failed-login', label:'Multiple Failed Login Attempts', category:'Authentication', severity:'medium', weight:12, patterns:[/failed login/i,/authentication failure/i,/invalid password/i,/login failed/i] },
  { id:'brute-force', label:'Brute Force Pattern', category:'Authentication', severity:'high', weight:24, patterns:[/brute[ -]?force/i,/multiple failed attempts/i,/credential stuffing/i] },
  { id:'unauthorized', label:'Unauthorized Access Attempt', category:'Access Control', severity:'high', weight:22, patterns:[/unauthorized access/i,/access denied/i,/permission denied/i,/forbidden resource/i] },
  { id:'sql-injection', label:'SQL Injection Indicator', category:'Web Attack', severity:'critical', weight:30, patterns:[/sql injection/i,/union\s+select/i,/or\s+1=1/i,/drop\s+table/i] },
  { id:'port-scan', label:'Port Scanning Activity', category:'Reconnaissance', severity:'high', weight:20, patterns:[/port scan/i,/syn scan/i,/nmap/i,/multiple ports probed/i] },
  { id:'malware', label:'Malware Indicator', category:'Malware', severity:'critical', weight:30, patterns:[/malware/i,/trojan/i,/ransomware/i,/malicious payload/i,/virus detected/i] },
  { id:'priv-esc', label:'Privilege Escalation Attempt', category:'Privilege', severity:'critical', weight:28, patterns:[/privilege escalation/i,/sudo failure/i,/root access attempt/i,/elevated privileges/i] },
  { id:'suspicious-ip', label:'Suspicious IP Activity', category:'Network', severity:'medium', weight:14, patterns:[/suspicious ip/i,/blacklisted ip/i,/known malicious ip/i] },
  { id:'dos', label:'Possible Denial-of-Service Pattern', category:'Availability', severity:'high', weight:24, patterns:[/dos attack/i,/ddos/i,/request flood/i,/connection flood/i] },
  { id:'data-exfil', label:'Possible Data Exfiltration', category:'Data Loss', severity:'critical', weight:30, patterns:[/data exfiltration/i,/large outbound transfer/i,/unusual outbound traffic/i,/sensitive data transfer/i] },
  { id:'phishing', label:'Phishing Indicator', category:'Social Engineering', severity:'high', weight:20, patterns:[/phishing/i,/credential harvesting/i,/fake login page/i] }
];
