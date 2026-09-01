# Project Overview

## Problem
Cybersecurity systems generate large amounts of log data. Suspicious actions may be hidden among normal events, making manual inspection slow and difficult.

## Demo Goal
AI Cyber Threat Analyzer demonstrates a simplified security-analysis workflow:

1. Collect security data in a log file.
2. Analyze each line for suspicious indicators.
3. Group matches into security categories.
4. Calculate a transparent risk score.
5. Generate a readable alert and recommendation.

## Why Browser-Side?
The classroom version is designed to run directly on GitHub Pages. GitHub Pages hosts static HTML/CSS/JavaScript and does not execute a Python backend. Therefore this demo uses JavaScript and the browser File API so the live demonstration works with no server.

## Privacy
Uploaded files stay inside the user's browser session. The demo does not transmit or store log files on a remote server.

## Academic Scope
This is an educational proof-of-concept. It is intentionally explainable and deterministic so students can see exactly why an event was flagged.
