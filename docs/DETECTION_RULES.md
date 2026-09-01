# Detection Rules

The analyzer uses weighted text-pattern rules located in `js/threat-rules.js`.

| Indicator | Category | Typical Severity |
|---|---|---|
| Multiple failed logins | Authentication | Medium |
| Brute-force pattern | Authentication | High |
| Unauthorized access | Access Control | High |
| SQL injection | Web Attack | Critical |
| Port scan | Reconnaissance | High |
| Malware / ransomware | Malware | Critical |
| Privilege escalation | Privilege | Critical |
| Suspicious IP | Network | Medium |
| DoS / DDoS | Availability | High |
| Data exfiltration | Data Loss | Critical |
| Phishing | Social Engineering | High |

## Scoring
Each indicator contributes weighted points. Repeated matches can add a limited bonus. Critical detections and multiple simultaneous indicators can further increase the overall risk score.

The final score is capped at 100.

## Why Rule-Based?
For a classroom live demo, rules are fast, understandable, and work entirely in a static GitHub Pages site. A production security tool would need stronger parsing, validation, threat intelligence, anomaly detection, machine learning, tuning, and human review.
