import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT_APP || 3000);
const HOST = '0.0.0.0';
const APK_PATH = path.resolve('app/build/outputs/apk/debug/app-debug.apk');

const HTML = `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>cSploit v2.0 — Android Security &amp; Diagnostics Suite</title>
  <style>
    :root {
      --bg: #020617;
      --surface: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --crimson: #dc2626;
      --crimson-light: #f87171;
      --emerald: #10b981;
      --amber: #f59e0b;
      --cyan: #38bdf8;
      --text: #f1f5f9;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 20;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--crimson); display: grid; place-items: center;
      font-weight: 800; color: #fff; font-family: monospace;
      box-shadow: 0 6px 20px rgba(220,38,38,0.35);
    }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .badge {
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--card);
    }
    .badge-red { color: var(--crimson-light); background: rgba(220,38,38,0.16); border-color: rgba(248,113,113,0.4); }
    .badge-green { color: var(--emerald); background: rgba(16,185,129,0.14); border-color: rgba(16,185,129,0.35); }
    .badge-amber { color: var(--amber); background: rgba(245,158,11,0.14); border-color: rgba(245,158,11,0.35); }
    .actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    button, .btn {
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      padding: 8px 13px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    button.primary, .btn.primary {
      background: var(--crimson);
      border-color: var(--crimson);
      color: #fff;
    }
    button.primary:hover, .btn.primary:hover { background: #b91c1c; }
    .layout {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    nav {
      width: 220px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-shrink: 0;
    }
    nav button {
      justify-content: space-between;
      width: 100%;
      background: transparent;
      border-color: transparent;
      color: var(--muted);
      text-align: left;
    }
    nav button.active {
      background: rgba(220,38,38,0.18);
      border-color: rgba(248,113,113,0.35);
      color: var(--crimson-light);
    }
    main {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      max-width: 1120px;
    }
    .banner {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 14px;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      font-family: ui-monospace, monospace;
      font-size: 12px;
    }
    input, select, textarea {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 9px 11px;
      border-radius: 8px;
      font-family: ui-monospace, monospace;
      font-size: 13px;
    }
    table { width: 100%; border-collapse: collapse; font-family: ui-monospace, monospace; font-size: 12px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); }
    th { color: var(--muted); font-size: 11px; text-transform: uppercase; }
    .hidden { display: none; }
    @media (max-width: 760px) {
      .layout { flex-direction: column; }
      nav { width: 100%; flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--border); }
      nav button { width: auto; white-space: nowrap; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="logo">cS</div>
      <div>
        <div style="display:flex;align-items:center;gap:8px;">
          <strong style="font-size:16px;">cSploit v2.0</strong>
          <span class="badge badge-red">Android API 36 + Web Companion</span>
        </div>
        <div class="mono" style="font-size:11px;color:var(--emerald);">wlan0: 192.168.1.105 &bull; GW: 192.168.1.1</div>
      </div>
    </div>
    <div class="actions">
      <button id="mitmBtn" onclick="toggleMitm()">MITM: OFF</button>
      <button class="primary" onclick="scanSubnet()">Scan Subnet</button>
      <a class="btn" href="/download/app-debug.apk">Download APK</a>
    </div>
  </header>

  <div class="layout">
    <nav id="sidebar">
      <button class="active" data-tab="radar" onclick="switchTab('radar')"><span>Network Radar</span><span class="badge" id="hostCount">4</span></button>
      <button data-tab="ports" onclick="switchTab('ports')"><span>Port Scanner</span></button>
      <button data-tab="vulns" onclick="switchTab('vulns')"><span>CVE Finder</span><span class="badge badge-red">4</span></button>
      <button data-tab="mitm" onclick="switchTab('mitm')"><span>MITM Suite</span></button>
      <button data-tab="nettools" onclick="switchTab('nettools')"><span>NetTools (New)</span></button>
      <button data-tab="cracker" onclick="switchTab('cracker')"><span>Login Cracker</span></button>
      <button data-tab="wifi" onclick="switchTab('wifi')"><span>WiFi Keygen</span></button>
      <button data-tab="forger" onclick="switchTab('forger')"><span>Packet Forger</span></button>
      <button data-tab="msf" onclick="switchTab('msf')"><span>Metasploit RPC</span><span class="badge badge-green" id="msfCount">1</span></button>
      <button data-tab="console" onclick="switchTab('console')"><span>Console Logs</span><span class="badge" id="logCount">4</span></button>
    </nav>

    <main>
      <section id="tab-radar"></section>
      <section id="tab-ports" class="hidden"></section>
      <section id="tab-vulns" class="hidden"></section>
      <section id="tab-mitm" class="hidden"></section>
      <section id="tab-nettools" class="hidden"></section>
      <section id="tab-cracker" class="hidden"></section>
      <section id="tab-wifi" class="hidden"></section>
      <section id="tab-forger" class="hidden"></section>
      <section id="tab-msf" class="hidden"></section>
      <section id="tab-console" class="hidden"></section>
    </main>
  </div>

  <script>
    const state = {
      tab: 'radar',
      mitm: false,
      hosts: [
        { id:'h1', ip:'192.168.1.1', mac:'00:11:22:33:44:55', hostname:'router.home', vendor:'TP-Link Technologies', os:'Linux 5.x / OpenWrt', role:'GW', ports:[{p:22,s:'ssh',v:'Dropbear 2022.83'},{p:53,s:'domain',v:'dnsmasq 2.89'},{p:80,s:'http',v:'uhttpd 1.0.0'},{p:443,s:'https',v:'OpenSSL 3.0'}], vulns:[{cve:'CVE-2021-31805',sev:'CRITICAL',score:9.8,title:'RouterOS / OpenWrt RCE',mod:'exploit/linux/http/router_rce'}] },
        { id:'h2', ip:'192.168.1.105', mac:'74:DA:38:12:9A:BC', hostname:'android-device.local', vendor:'Google LLC', os:'Android 15 (API 35/36)', role:'YOU', ports:[{p:5555,s:'adb',v:'Android Debug Bridge'}], vulns:[] },
        { id:'h3', ip:'192.168.1.112', mac:'B8:27:EB:4F:1A:88', hostname:'raspberrypi.home', vendor:'Raspberry Pi Foundation', os:'Debian 12 Bookworm', role:'', ports:[{p:22,s:'ssh',v:'OpenSSH 9.2p1'},{p:80,s:'http',v:'Apache 2.4.57'},{p:445,s:'microsoft-ds',v:'Samba 4.17'}], vulns:[{cve:'CVE-2021-41773',sev:'CRITICAL',score:9.8,title:'Apache Path Traversal & RCE',mod:'exploit/multi/http/apache_normalize_path_rce'}] },
        { id:'h4', ip:'192.168.1.140', mac:'AC:DE:48:78:90:12', hostname:'smart-tv.home', vendor:'LG Electronics', os:'webOS 23', role:'', ports:[{p:3000,s:'hbbtv',v:'WebSocket RPC'},{p:9999,s:'upnp',v:'MediaRenderer'}], vulns:[{cve:'CVE-2023-27136',sev:'HIGH',score:8.5,title:'LG webOS PIN Bypass',mod:''}] }
      ],
      selectedIp: '192.168.1.1',
      creds: [
        { time:'14:22:05', proto:'HTTP', ip:'192.168.1.112', user:'admin', pass:'SuperSecretPassword123' },
        { time:'14:25:10', proto:'FTP', ip:'192.168.1.1', user:'root', pass:'root' }
      ],
      dnsRules: [
        { domain:'update.antivirus.local', ip:'192.168.1.105', on:true },
        { domain:'login.corpnet.internal', ip:'192.168.1.105', on:false }
      ],
      msfSessions: [
        { id:1, target:'192.168.1.112', tunnel:'192.168.1.105:4444 -> 192.168.1.112:38421', mod:'exploit/multi/http/apache_normalize_path_rce' }
      ],
      shellLines: ['cSploit MSF RPC Bridge [v2.0.0]', 'Connected to session #1 (192.168.1.112)', ''],
      logs: [
        { time:'14:00:01', src:'CORE', msg:'cSploit v2.0 Modernized initialized (Android API 36 + Web Companion).' },
        { time:'14:00:02', src:'RADAR', msg:'Subnet 192.168.1.0/24 scanned: 4 hosts online.' },
        { time:'14:00:15', src:'MITM', msg:'ARP & packet inspection engine standing by.' },
        { time:'14:05:30', src:'MSF', msg:'Metasploit RPC daemon connected (127.0.0.1:55553).' }
      ]
    };

    function addLog(src, msg) {
      state.logs.unshift({ time: new Date().toLocaleTimeString(), src, msg });
      document.getElementById('logCount').textContent = state.logs.length;
      if (state.tab === 'console') renderConsole();
    }

    function switchTab(tab) {
      state.tab = tab;
      document.querySelectorAll('#sidebar button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
      document.getElementById('tab-' + tab).classList.remove('hidden');
      renderActive();
    }

    function toggleMitm() {
      state.mitm = !state.mitm;
      const btn = document.getElementById('mitmBtn');
      btn.textContent = state.mitm ? 'MITM: ARMED' : 'MITM: OFF';
      btn.classList.toggle('primary', state.mitm);
      addLog('MITM', state.mitm ? 'ARP spoofing engine ARMED on wlan0.' : 'ARP spoofing engine disarmed.');
    }

    function scanSubnet() {
      addLog('RADAR', 'Subnet discovery scan completed: ' + state.hosts.length + ' hosts online.');
      renderRadar();
    }

    function renderRadar() {
      const el = document.getElementById('tab-radar');
      el.innerHTML = \`
        <div class="banner">
          <div>
            <div class="mono" style="font-size:11px;color:var(--crimson-light);">SUBNET RADAR &bull; 192.168.1.0/24</div>
            <h2 style="margin:4px 0 6px;">Discovered Network Hosts</h2>
            <div style="color:var(--muted);font-size:13px;">Modernized non-root + root compatible host mapper. Native Android APK available via Download APK.</div>
          </div>
          <div style="display:flex;gap:8px;">
            <input id="addIpInput" placeholder="192.168.1.200" style="width:150px;" />
            <button class="primary" onclick="const v=document.getElementById('addIpInput').value.trim(); if(v){state.hosts.unshift({id:'h_'+Date.now(),ip:v,mac:'AA:BB:CC:DD:EE:FF',hostname:v,vendor:'Custom Target',os:'TCP/IP Host',role:'',ports:[{p:80,s:'http',v:'HTTP'}],vulns:[]}); document.getElementById('hostCount').textContent=state.hosts.length; addLog('RADAR','Added host '+v); renderRadar();}">+ Add Host</button>
          </div>
        </div>
        <div class="grid">
          \${state.hosts.map(h => \`
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:start;">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <strong>\${h.hostname}</strong>
                    \${h.role ? \`<span class="badge badge-red">\${h.role}</span>\` : ''}
                  </div>
                  <div class="mono" style="color:var(--crimson-light);font-size:13px;margin-top:2px;">\${h.ip}</div>
                </div>
                <span class="badge badge-green">ONLINE</span>
              </div>
              <div class="box">
                <div>MAC: \${h.mac}</div>
                <div>Vendor: \${h.vendor}</div>
                <div>OS: \${h.os}</div>
              </div>
              <div style="display:flex;gap:8px;">
                <button style="flex:1;justify-content:center;" onclick="state.selectedIp='\${h.ip}';switchTab('ports')">Port Scan (\${h.ports.length})</button>
                <button class="primary" style="flex:1;justify-content:center;" onclick="state.selectedIp='\${h.ip}';switchTab('vulns')">CVEs (\${h.vulns.length})</button>
              </div>
            </div>
          \`).join('')}
        </div>
      \`;
    }

    function renderPorts() {
      const host = state.hosts.find(h => h.ip === state.selectedIp) || state.hosts[0];
      document.getElementById('tab-ports').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">PORT SCANNER</div><h2 style="margin:4px 0;">TCP/UDP Port Scanner &bull; \${host.ip}</h2></div>
        <select onchange="state.selectedIp=this.value;renderPorts()" style="width:220px;">\${state.hosts.map(h => \`<option value="\${h.ip}" \${h.ip===host.ip?'selected':''}>\${h.ip} (\${h.hostname})</option>\`).join('')}</select></div>
        <div class="card"><table><thead><tr><th>Port</th><th>Protocol</th><th>Service</th><th>Version</th><th>State</th></tr></thead><tbody>
        \${host.ports.map(p => \`<tr><td style="color:var(--crimson-light);font-weight:700;">\${p.p}</td><td>tcp</td><td>\${p.s}</td><td>\${p.v}</td><td><span class="badge badge-green">OPEN</span></td></tr>\`).join('')}
        </tbody></table></div>
      \`;
    }

    function renderVulns() {
      const host = state.hosts.find(h => h.ip === state.selectedIp) || state.hosts[0];
      document.getElementById('tab-vulns').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">CVE & EXPLOIT FINDER</div><h2 style="margin:4px 0;">Vulnerabilities &bull; \${host.ip}</h2></div>
        <select onchange="state.selectedIp=this.value;renderVulns()" style="width:220px;">\${state.hosts.map(h => \`<option value="\${h.ip}" \${h.ip===host.ip?'selected':''}>\${h.ip} (\${h.vulns.length} CVEs)</option>\`).join('')}</select></div>
        <div class="grid">\${host.vulns.length ? host.vulns.map(v => \`
          <div class="card">
            <div style="display:flex;gap:8px;"><span class="badge badge-red">\${v.cve}</span><span class="badge badge-amber">CVSS \${v.score} \${v.sev}</span></div>
            <strong>\${v.title}</strong>
            \${v.mod ? \`<div class="box">Module: \${v.mod}</div><button class="primary" onclick="state.msfSessions.push({id:state.msfSessions.length+1,target:'\${host.ip}',tunnel:'192.168.1.105:4444 -> \${host.ip}:38499',mod:'\${v.mod}'});document.getElementById('msfCount').textContent=state.msfSessions.length;addLog('MSF','Opened session on \${host.ip} via \${v.cve}');switchTab('msf')">Launch Exploit</button>\` : '<div style="color:var(--muted);font-size:12px;">Advisory only</div>'}
          </div>\`).join('') : '<div class="card">No CVEs matched for this host.</div>'}</div>
      \`;
    }

    function renderMitm() {
      document.getElementById('tab-mitm').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">MITM FRAMEWORK</div><h2 style="margin:4px 0;">Password Sniffer & DNS Spoofing</h2></div>
        <button class="primary" onclick="toggleMitm();renderMitm()">\${state.mitm?'Stop ARP Spoof':'Arm ARP Spoof'}</button></div>
        <div class="card" style="margin-bottom:14px;"><strong>Captured Credentials</strong><table><thead><tr><th>Time</th><th>Proto</th><th>Target</th><th>Username</th><th>Password</th></tr></thead><tbody>
        \${state.creds.map(c => \`<tr><td>\${c.time}</td><td style="color:var(--crimson-light);">\${c.proto}</td><td>\${c.ip}</td><td style="color:var(--emerald);">\${c.user}</td><td style="color:var(--amber);">\${c.pass}</td></tr>\`).join('')}
        </tbody></table></div>
        <div class="card"><strong>DNS Spoof Rules</strong>
        \${state.dnsRules.map((r,i) => \`<div class="box" style="display:flex;justify-content:space-between;align-items:center;"><span>\${r.domain} &rarr; \${r.ip}</span><button onclick="state.dnsRules[\${i}].on=!state.dnsRules[\${i}].on;renderMitm()">\${r.on?'ENABLED':'DISABLED'}</button></div>\`).join('')}
        </div>
      \`;
    }

    function renderNetTools() {
      document.getElementById('tab-nettools').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--emerald);">NEW MODERN TOOLS</div><h2 style="margin:4px 0;">TLS Inspector, DNS/HTTP Audit & Report Export</h2>
        <div style="color:var(--muted);font-size:13px;">Full live SSLSocketFactory, HttpURLConnection security header audit, and TCP latency probes run natively in the Android APK.</div></div>
        <a class="btn primary" href="/download/app-debug.apk">Download Android APK</a></div>
        <div class="grid">
          <div class="card"><strong>TLS / SSL Certificate Inspector</strong><div class="box">Inspects X.509 Subject, Issuer, Cipher Suite, TLS 1.3 Protocol, and SHA-256 fingerprint natively on Android.</div></div>
          <div class="card"><strong>HTTP Security Header Auditor</strong><div class="box">Checks HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.</div></div>
          <div class="card"><strong>TCP Latency Monitor</strong><div class="box">Measures real socket RTT milliseconds across 6 sequential probes.</div></div>
        </div>
      \`;
    }

    function renderCracker() {
      document.getElementById('tab-cracker').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">HYDRA LOGIN CRACKER</div><h2 style="margin:4px 0;">Service Brute-Forcer</h2></div></div>
        <div class="card">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <input id="crackIp" value="192.168.1.1" />
            <select id="crackProto"><option>SSH (22)</option><option>FTP (21)</option><option>HTTP (80)</option><option>SMB (445)</option></select>
          </div>
          <button class="primary" onclick="document.getElementById('crackOut').textContent='[+] Found valid login on '+document.getElementById('crackIp').value+': root / password123';addLog('HYDRA','Found credentials on '+document.getElementById('crackIp').value)">Start Dictionary Audit</button>
          <div id="crackOut" class="box" style="color:var(--emerald);">Ready.</div>
        </div>
      \`;
    }

    function renderWifi() {
      document.getElementById('tab-wifi').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">WIFI KEYGEN</div><h2 style="margin:4px 0;">Wireless AP Security Audit</h2></div></div>
        <div class="grid">
          <div class="card"><strong>TP-Link_Guest_99</strong><div class="box">BSSID: C0:25:E9:12:34:56 &bull; WPA2-PSK<br/>Keygen: TPLINK98765</div></div>
          <div class="card"><strong>Thomson_F48A21</strong><div class="box">BSSID: 00:19:3E:F4:8A:21 &bull; WEP<br/>Keygen: 4A21F48A21</div></div>
          <div class="card"><strong>SecureHome_5G_WiFi6</strong><div class="box">BSSID: 98:DE:D0:11:22:33 &bull; WPA3-SAE<br/>Status: SECURE</div></div>
        </div>
      \`;
    }

    function renderForger() {
      document.getElementById('tab-forger').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">PACKET FORGER</div><h2 style="margin:4px 0;">Custom TCP / UDP / ICMP Frame Builder</h2></div></div>
        <div class="card">
          <input id="pktDst" value="192.168.1.1:80" />
          <textarea id="pktBody" rows="4">GET / HTTP/1.1\r\nHost: target\r\n\r\n</textarea>
          <button class="primary" onclick="const d=document.getElementById('pktDst').value;addLog('FORGER','Dispatched forged packet to '+d);document.getElementById('pktStatus').textContent='Dispatched packet to '+d;">Transmit Packet</button>
          <div id="pktStatus" class="box" style="color:var(--emerald);">Ready to transmit.</div>
        </div>
      \`;
    }

    function renderMsf() {
      document.getElementById('tab-msf').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">METASPLOIT RPC</div><h2 style="margin:4px 0;">Active Exploitation Sessions</h2></div><span class="badge badge-green">RPCd 55553</span></div>
        <div class="card" style="margin-bottom:14px;">\${state.msfSessions.map(s => \`<div class="box">#\${s.id} &bull; \${s.target} &bull; \${s.tunnel} &bull; \${s.mod}</div>\`).join('')}</div>
        <div class="card">
          <div class="box" id="msfTerm" style="min-height:140px;color:var(--emerald);">\${state.shellLines.map(l => \`<div>\${l}</div>\`).join('')}</div>
          <div style="display:flex;gap:8px;">
            <input id="msfCmd" placeholder="whoami, sysinfo, uname -a..." />
            <button class="primary" onclick="const i=document.getElementById('msfCmd');if(i.value){state.shellLines.push('root# '+i.value,'Executed: '+i.value);i.value='';renderMsf();}">Send</button>
          </div>
        </div>
      \`;
    }

    function renderConsole() {
      document.getElementById('tab-console').innerHTML = \`
        <div class="banner"><div><div class="mono" style="font-size:11px;color:var(--crimson-light);">CONSOLE</div><h2 style="margin:4px 0;">Event & Audit Logs</h2></div>
        <button onclick="state.logs=[];document.getElementById('logCount').textContent='0';renderConsole()">Clear Logs</button></div>
        <div class="card">\${state.logs.map(l => \`<div class="box"><span style="color:var(--muted);">[\${l.time}]</span> <span class="badge badge-red">\${l.src}</span> \${l.msg}</div>\`).join('')}</div>
      \`;
    }

    function renderActive() {
      const map = {
        radar: renderRadar, ports: renderPorts, vulns: renderVulns, mitm: renderMitm,
        nettools: renderNetTools, cracker: renderCracker, wifi: renderWifi,
        forger: renderForger, msf: renderMsf, console: renderConsole
      };
      map[state.tab]();
    }
    renderActive();
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', port: PORT }));
    return;
  }

  if (req.url === '/download/app-debug.apk') {
    if (fs.existsSync(APK_PATH)) {
      const stat = fs.statSync(APK_PATH);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="csploit-v2.0-debug.apk"',
        'Content-Length': stat.size
      });
      fs.createReadStream(APK_PATH).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('APK not built yet. Run compile_applet / gradle assembleDebug.');
    }
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});

server.listen(PORT, HOST, () => {
  console.log(`cSploit companion server listening on http://${HOST}:${PORT}`);
});
