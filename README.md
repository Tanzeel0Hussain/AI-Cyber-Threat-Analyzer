# 🛡️ AI Cyber Threat Analyzer

An interactive **cybersecurity threat-analysis demo** that scans `.log` and `.txt` files for suspicious activity, calculates a risk score, explains matched indicators, and provides security recommendations — entirely in the browser.

> Built as a companion project for the presentation **“AI in Cybersecurity: Detecting and Preventing Cyber Attacks.”**

## ✨ Features

- Drag-and-drop `.log` / `.txt` file analysis
- Rule-based detection of 10+ security indicators
- Risk score from **0–100**
- Threat levels: Minimal, Low, Medium, High, Critical
- Detects patterns related to:
  - Failed login attempts
  - Brute-force activity
  - Unauthorized access
  - SQL injection
  - Port scanning
  - Malware / ransomware indicators
  - Privilege escalation
  - Suspicious IP activity
  - DoS / DDoS patterns
  - Possible data exfiltration
  - Phishing indicators
- Shows exact matched evidence from the uploaded log
- Threat-category breakdown
- Contextual security recommendations
- Two downloadable sample logs for a live classroom demo
- Privacy-friendly: files are processed locally and are **not uploaded to a server**
- Responsive dark cyber / glassmorphism interface
- Works on **GitHub Pages** with no backend required

## 🚀 Live Demo

After enabling GitHub Pages, your URL will normally be:

`https://tanzeel0hussain.github.io/AI-Cyber-Threat-Analyzer/`

## 🎬 Classroom Demo Flow

1. Open the live GitHub Pages website.
2. Download `samples/suspicious_activity.log` from the repository or the website.
3. Upload it to the analyzer.
4. Show the **Suspicious Activity Detected** result, risk score, matched indicators, evidence, and recommendation.
5. Download `samples/normal_activity.log`.
6. Upload it and show the **No Suspicious Activity Detected** result.
7. Open the `presentation/` folder and download the PowerPoint presentation.

## 🧠 How Detection Works

This academic version uses a transparent **rule-based threat scoring engine**:

`Log File → Read Locally → Match Security Rules → Score Risk → Explain Evidence → Recommend Action`

Each detection rule has:

- One or more text patterns
- A security category
- A severity level
- A weighted score

Repeated events can increase the score. Multiple failed-login events can also trigger a derived brute-force indicator.

## ⚠️ Important Accuracy Note

This version is a **rule-based cybersecurity concept demo**, not a production Intrusion Detection System and not a trained machine-learning model. It demonstrates the same high-level security workflow discussed in the presentation: collect data, analyze activity, identify suspicious patterns, generate an alert, and support human investigation.

A future version could replace or augment the rule engine with a trained model using Scikit-learn and a real intrusion-detection dataset.

## 📁 Project Structure

```text
AI-Cyber-Threat-Analyzer/
├── index.html
├── README.md
├── LICENSE
├── .nojekyll
├── css/
├── js/
├── assets/icons/
├── samples/
├── presentation/
├── docs/
└── screenshots/
```

## 🛠️ Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser File API
- GitHub Pages

No framework, database, API key, or server is required.

## 💻 Run Locally

You can simply open `index.html` in a browser.

For a local HTTP server:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000`

## 🌐 Deploy on GitHub Pages

1. Create a repository named **AI-Cyber-Threat-Analyzer**.
2. Upload all project files to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Save.
7. Wait a short time for GitHub Pages to publish the site.

## 📊 Sample Files

### `suspicious_activity.log`
Contains intentionally suspicious demo events such as repeated failed logins, brute-force behavior, suspicious IP activity, port scanning, unauthorized access, privilege escalation, and SQL injection.

### `normal_activity.log`
Contains routine login, application, backup, monitoring, and network events with no known suspicious indicators used by this demo.

## 📚 Documentation

- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md)
- [`docs/DETECTION_RULES.md`](docs/DETECTION_RULES.md)
- [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md)

## 👤 Author

**Tanzeel Hussain**  
BS Computer Science  
GitHub: [@Tanzeel0Hussain](https://github.com/Tanzeel0Hussain)

## 📄 License

MIT License — see [`LICENSE`](LICENSE).
