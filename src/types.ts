export type TabType = 
  | 'radar' 
  | 'ports' 
  | 'vulnerabilities' 
  | 'mitm' 
  | 'cracker' 
  | 'wifi' 
  | 'forger' 
  | 'metasploit' 
  | 'console';

export interface Host {
  id: string;
  ip: string;
  mac: string;
  hostname: string;
  vendor: string;
  os: string;
  status: 'online' | 'offline';
  isRouter: boolean;
  isSelf: boolean;
  ports: PortInfo[];
  vulnerabilities: Vulnerability[];
}

export interface PortInfo {
  port: number;
  protocol: 'tcp' | 'udp';
  service: string;
  state: 'open' | 'closed' | 'filtered';
  version?: string;
}

export interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  description: string;
  exploitAvailable: boolean;
  moduleName?: string;
}

export interface SniffedCredential {
  id: string;
  timestamp: string;
  protocol: 'HTTP' | 'FTP' | 'TELNET' | 'POP3' | 'IMAP';
  targetIp: string;
  username: string;
  password: string;
  details: string;
}

export interface DnsRule {
  id: string;
  domain: string;
  redirectIp: string;
  enabled: boolean;
}

export interface HijackedSession {
  id: string;
  domain: string;
  cookieName: string;
  cookieValue: string;
  username: string;
  timestamp: string;
}

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  rssi: number;
  channel: number;
  encryption: 'WPA2' | 'WEP' | 'WPS' | 'OPEN';
  vulnerable: boolean;
  defaultKeys?: string[];
  algorithm?: string;
}

export interface MsfSession {
  id: number;
  type: string;
  tunnel: string;
  viaExploit: string;
  viaPayload: string;
  target: string;
  active: boolean;
}

export interface ConsoleLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'exploit';
  message: string;
  source: string;
}
