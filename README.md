# cSploit v2.0 — Modernized Android Network Security & Diagnostics Suite

Modernized native Android (Kotlin + Jetpack Compose + Material 3) rebuild of **cSploit**, updated for Android 14/15/16 (compileSdk 36, minSdk 24) with full non-root compatibility alongside root-mode hooks.

## Features
- **Network Radar**: Auto-detects local interface, IP, gateway, DNS, and subnet; supports custom host targets and subnet sweeps.
- **Port Scanner**: Quick/Full/Banner profiles plus a live Android TCP socket & banner probe.
- **Vulnerability & CVE Finder**: Correlates services with CVE records and launches Metasploit sessions.
- **MITM Framework**: ARP spoof controls, credential sniffer, DNS spoof rules, cookie hijacker, and HTTP traffic injection.
- **NetTools (New)**:
  - **TLS/SSL Certificate Inspector** via `SSLSocketFactory` (protocol, cipher, X.509 issuer/subject, SHA-256 fingerprint)
  - **DNS & HTTP Security Header Auditor** (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - **TCP Latency & Reachability Monitor**
  - **Markdown Security Audit Report Export & Share**
- **Login Cracker (Hydra)**, **WiFi Keygen**, **Packet Forger** (with real `DatagramSocket` UDP dispatch), **Metasploit RPC Interactive Shell**, and **Terminal Console**.
