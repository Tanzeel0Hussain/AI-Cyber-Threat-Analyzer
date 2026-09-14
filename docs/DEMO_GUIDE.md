# Live Presentation Demo Guide

## Before class
- Publish the repository with GitHub Pages.
- Test the website once on the same browser you will use in class.
- Keep the two sample files available in the repository.
- Keep the PowerPoint inside `presentation/`.

## Demo 1 — Suspicious Log
1. Open the live website.
2. Download `suspicious_activity.log`.
3. Upload it into the analyzer.
4. Click **Analyze Threats**.
5. Explain the risk score.
6. Point out matched indicators and exact evidence lines.
7. Show the recommended action.

Suggested speaking line:

> “This sample contains repeated failed logins and other suspicious patterns. The analyzer checks the log, scores the indicators, and explains why it generated an alert.”

## Demo 2 — Normal Log
1. Download `normal_activity.log`.
2. Upload it.
3. Click **Analyze Threats**.
4. Show the low/minimal risk result.

Suggested speaking line:

> “This file contains normal system activity. Because the demo does not find its known suspicious indicators, it reports no configured indicators matched. That does not prove the system is safe.”

## Important answer if asked “Is this real AI?”

Say:

> “This classroom version is a rule-based cybersecurity concept demo. It demonstrates the detection pipeline. A full AI version could train a machine-learning model on a real intrusion-detection dataset and use that model instead of only predefined rules.”

## Regression checks

With Node.js installed, run from any working directory:

```bash
node tests/regression.cjs
```

Run the command from the repository root, or supply the absolute path to the script. No npm dependencies are needed. The same suite runs on GitHub Actions.

The suite covers both provided samples, original line numbers, SSH authentication failures, repetition evidence, input boundaries, escaped output, and reset/reselection during asynchronous reads. UI-state checks use a small DOM adapter; they do not validate browser layout or native file-picker behavior.

Before presenting, also check in a real browser: choose-file keyboard access, drag/drop, mobile layout, and both sample results. Older screenshots may show the previous UI wording.
