# Detection Rules

The analyzer uses weighted text-pattern rules located in `js/threat-rules.js`.

| Indicator | Category | Typical Severity |
|---|---|---|
| Failed authentication (including SSH Failed password) | Authentication | Medium |
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

## Input and evidence

Only files ending in .log or .txt are accepted, up to 2 MiB (2,097,152 bytes). Empty, whitespace-only, and text containing binary control characters are rejected. Export logs as UTF-8; this is a lightweight binary check, not a full file-format detector.

Evidence uses the original 1-based physical line number, including blank lines in the numbering. The Log Lines metric counts nonempty entries. CRLF, LF, and CR separators are supported.

The dashboard shows the first 12 rule matches in source-line order and displays the shown/total count. One line can match multiple rules. Category totals count rule matches, not unique events or confirmed attacks.

## Repeated authentication failures

Four or more failed-authentication lines anywhere in the file add a file-wide repetition finding worth 30 points, unless an explicit brute-force phrase already matched. The derived finding includes its supporting lines.

This check does not correlate accounts, source addresses, or a time window. It is labelled repeated authentication failures, not a confirmed brute-force attack.

## Exact score

For each configured rule: weight + min(3 × (matches − 1), 12).
Add 10 if any finding has critical severity, and 8 if there are at least four findings. Add the derived repetition finding as described above. Cap the total at 100.

Score bands: MINIMAL below 8; LOW 8–24; MEDIUM 25–49; HIGH 50–74; CRITICAL 75–100. Individual rule severity and aggregate score band are different measures.

The score is a demonstration heuristic, not a calibrated probability. Keywords can occur in benign text, negated messages, or training material. Unknown attacks may not match at all. Review context before taking action; no configured matches does not prove safety.
