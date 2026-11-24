import { Host, SniffedCredential, DnsRule, HijackedSession, WifiNetwork, MsfSession, ConsoleLog } from './types';

export const INITIAL_HOSTS: Host[] = [
  {
    id: 'h1',
    ip: '192.168.1.1',
    mac: '00:11:22:33:44:55',
    hostname: 'router.home',
    vendor: 'TP-Link Technologies',
    os: 'Linux 3.x / OpenWrt',
    status: 'online',
    isRouter: true,
    isSelf: false,
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', state: 'open', version: 'Dropbear sshd 2018.76' },
      { port: 53, protocol: 'tcp', service: 'domain', state: 'open', version: 'dnsmasq 2.80' },
      { port: 80, protocol: 'tcp', service: 'http', state: 'open', version: 'uhttpd 1.0.0' },
      { port: 443, protocol: 'tcp', service: 'https', state: 'open' }
    ],
    vulnerabilities: [
      {
        id: 'v1',
        cve: 'CVE-2021-31805',
        title: 'RouterOS / OpenWrt Remote Code Execution',
        severity: 'critical',
        score: 9.8,
        description: 'Unauthenticated RCE vulnerability in web management interface.',
        exploitAvailable: true,
        moduleName: 'exploit/linux/http/router_rce'
      },
      {
        id: 'v2',
        cve: 'CVE-2019-15107',
        title: 'Webmin <= 1.920 unauthenticated RCE',
        severity: 'high',
        score: 8.8,
        description: 'Password reset password_change.cgi backdoor.',
        exploitAvailable: true,
        moduleName: 'exploit/unix/webapp/webmin_backdoor'
      }
    ]
  },
  {
    id: 'h2',
    ip: '192.168.1.105',
    mac: '74:DA:38:12:9A:BC',
    hostname: 'android-device.home',
    vendor: 'Google, Inc.',
    os: 'Android 15 (Modernized)',
    status: 'online',
    isRouter: false,
    isSelf: true,
    ports: [
      { port: 5555, protocol: 'tcp', service: 'adb', state: 'open', version: 'Android Debug Bridge' }
    ],
    vulnerabilities: []
  },
  {
    id: 'h3',
    ip: '192.168.1.112',
    mac: 'B8:27:EB:4F:1A:88',
    hostname: 'raspberrypi.home',
    vendor: 'Raspberry Pi Foundation',
    os: 'Raspbian GNU/Linux 11',
    status: 'online',
    isRouter: false,
    isSelf: false,
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', state: 'open', version: 'OpenSSH 8.4p1 Debian' },
      { port: 80, protocol: 'tcp', service: 'http', state: 'open', version: 'Apache/2.4.54' },
      { port: 445, protocol: 'tcp', service: 'microsoft-ds', state: 'open', version: 'Samba smbd 4.13' }
    ],
    vulnerabilities: [
      {
        id: 'v3',
        cve: 'CVE-2021-41773',
        title: 'Apache 2.4.49 / 2.4.50 Path Traversal & RCE',
        severity: 'critical',
        score: 9.8,
        description: 'A flaw in path normalization could allow unauthenticated attackers to execute arbitrary shell scripts.',
        exploitAvailable: true,
        moduleName: 'exploit/multi/http/apache_normalize_path_rce'
      }
    ]
  },
  {
    id: 'h4',
    ip: '192.168.1.140',
    mac: 'AC:DE:48:78:90:12',
    hostname: 'smart-tv.home',
    vendor: 'LG Electronics',
    os: 'webOS 5.0',
    status: 'online',
    isRouter: false,
    isSelf: false,
    ports: [
      { port: 3000, protocol: 'tcp', service: 'hbbtv', state: 'open' },
      { port: 9999, protocol: 'tcp', service: 'tv-control', state: 'open' }
    ],
    vulnerabilities: [
      {
        id: 'v4',
        cve: 'CVE-2023-27136',
        title: 'LG webOS PIN Bypass & Command Execution',
        severity: 'high',
        score: 8.5,
        description: 'Insecure pin validation allows local network attackers to execute arbitrary system commands.',
        exploitAvailable: false
      }
    ]
  }
];

export const INITIAL_CREDENTIALS: SniffedCredential[] = [
  {
    id: 'c1',
    timestamp: '14:22:05',
    protocol: 'HTTP',
    targetIp: '192.168.1.112',
    username: 'admin',
    password: 'SuperSecretPassword123',
    details: 'POST /login.php HTTP/1.1 (Basic Auth / Form)'
  },
  {
    id: 'c2',
    timestamp: '14:25:10',
    protocol: 'FTP',
    targetIp: '192.168.1.1',
    username: 'root',
    password: 'root',
    details: 'USER root / PASS root (Plaintext FTP session)'
  }
];

export const INITIAL_DNS_RULES: DnsRule[] = [
  { id: 'd1', domain: 'update.antivirus.com', redirectIp: '192.168.1.105', enabled: true },
  { id: 'd2', domain: 'login.corpnet.internal', redirectIp: '192.168.1.105', enabled: false }
];

export const INITIAL_SESSIONS: HijackedSession[] = [
  {
    id: 's1',
    domain: 'admin.router.home',
    cookieName: 'session_id',
    cookieValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.secure99',
    username: 'admin',
    timestamp: '14:20:12'
  }
];

export const INITIAL_WIFI: WifiNetwork[] = [
  {
    ssid: 'TP-Link_Guest_99',
    bssid: 'C0:25:E9:12:34:56',
    rssi: -54,
    channel: 6,
    encryption: 'WPA2',
    vulnerable: true,
    defaultKeys: ['TPLINK98765', 'TP-LINK_12345678', 'admin2023'],
    algorithm: 'TP-Link WPS/WPA Keygen'
  },
  {
    ssid: 'Thomson_F48A21',
    bssid: '00:19:3E:F4:8A:21',
    rssi: -68,
    channel: 1,
    encryption: 'WEP',
    vulnerable: true,
    defaultKeys: ['4A21F48A21', '00193EF48A', '9876543210'],
    algorithm: 'Thomson Router Default Keygen'
  },
  {
    ssid: 'SecureHome_5G',
    bssid: '98:DE:D0:11:22:33',
    rssi: -42,
    channel: 36,
    encryption: 'WPA2',
    vulnerable: false
  }
];

export const INITIAL_MSF_SESSIONS: MsfSession[] = [
  {
    id: 1,
    type: 'shell',
    tunnel: '192.168.1.105:4444 -> 192.168.1.112:38421',
    viaExploit: 'exploit/multi/http/apache_normalize_path_rce',
    viaPayload: 'payload/cmd/unix/reverse_bash',
    target: '192.168.1.112',
    active: true
  }
];

export const INITIAL_LOGS: ConsoleLog[] = [
  { id: 'l1', timestamp: '14:00:01', level: 'info', source: 'Core', message: 'cSploit Web v1.7.0 Modernized initialized successfully.' },
  { id: 'l2', timestamp: '14:00:02', level: 'success', source: 'Radar', message: 'Subnet 192.168.1.0/24 scanned: 4 hosts online.' },
  { id: 'l3', timestamp: '14:00:15', level: 'warn', source: 'MITM', message: 'ARP spoofing engine armed on interface wlan0.' },
  { id: 'l4', timestamp: '14:05:30', level: 'exploit', source: 'Metasploit', message: 'Metasploit RPC daemon connected (127.0.0.1:55553).' }
];
