import React, { useState } from 'react';
import { SniffedCredential, DnsRule, HijackedSession } from '../types';
import { 
  Eye, 
  Key, 
  Globe, 
  Shield, 
  Play, 
  Square, 
  Trash2, 
  Plus, 
  Terminal, 
  CheckCircle2, 
  Lock,
  RefreshCw,
  FileText
} from 'lucide-react';

interface MitmFrameworkProps {
  mitmActive: boolean;
  onToggleMitm: () => void;
  credentials: SniffedCredential[];
  dnsRules: DnsRule[];
  onAddDnsRule: (rule: DnsRule) => void;
  onToggleDnsRule: (id: string) => void;
  onDeleteDnsRule: (id: string) => void;
  sessions: HijackedSession[];
  onAddLog: (level: any, source: string, message: string) => void;
}

export const MitmFramework: React.FC<MitmFrameworkProps> = ({
  mitmActive,
  onToggleMitm,
  credentials,
  dnsRules,
  onAddDnsRule,
  onToggleDnsRule,
  onDeleteDnsRule,
  sessions,
  onAddLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sniffer' | 'dns' | 'sessions' | 'redirect'>('sniffer');
  const [newDomain, setNewDomain] = useState('');
  const [newRedirectIp, setNewRedirectIp] = useState('192.168.1.105');
  const [redirectType, setRedirectType] = useState<'image' | 'text' | 'js'>('image');
  const [targetUrl, setTargetUrl] = useState('http://example.com/logo.png');
  const [replaceUrl, setReplaceUrl] = useState('https://i.imgur.com/cFll5P9.jpg');

  const handleAddDnsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    const rule: DnsRule = {
      id: 'd_' + Date.now(),
      domain: newDomain,
      redirectIp: newRedirectIp,
      enabled: true
    };
    onAddDnsRule(rule);
    onAddLog('success', 'MITM', `Added DNS Spoof rule: ${newDomain} -> ${newRedirectIp}`);
    setNewDomain('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>Man-in-the-Middle Attack Suite</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">MITM Framework & Sniffer</h2>
          <p className="text-slate-400 text-sm mt-1">
            Perform ARP spoofing, intercept plaintext credentials, spoof DNS records, and hijack active web sessions.
          </p>
        </div>
        <button
          onClick={onToggleMitm}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center space-x-2 transition shadow-lg ${
            mitmActive
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {mitmActive ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{mitmActive ? 'Stop MITM Attack' : 'Start ARP Spoof'}</span>
        </button>
      </div>

      <div className="flex border-b border-slate-800 space-x-6 overflow-x-auto">
        {[
          { id: 'sniffer', label: 'Password Sniffer', icon: Key, count: credentials.length },
          { id: 'dns', label: 'DNS Spoofing', icon: Globe, count: dnsRules.length },
          { id: 'sessions', label: 'Session Hijacker', icon: Lock, count: sessions.length },
          { id: 'redirect', label: 'Traffic Injection', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'sniffer' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 font-mono">Captured Plaintext Credentials</h3>
              <span className="text-xs font-mono text-emerald-400">Sniffer Active on wlan0</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-mono text-slate-400 uppercase">
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Protocol</th>
                    <th className="py-3 px-4">Target IP</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm font-mono">
                  {credentials.map((cred) => (
                    <tr key={cred.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 text-slate-400 text-xs">{cred.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-red-400">{cred.protocol}</td>
                      <td className="py-3 px-4 text-slate-300">{cred.targetIp}</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">{cred.username}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold select-all">{cred.password}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{cred.details}</td>
                    </tr>
                  ))}
                  {credentials.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-sm font-mono">
                        No credentials intercepted yet. Arm MITM ARP spoofing to capture traffic.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'dns' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-500" />
              <span>Add DNS Redirect Rule</span>
            </h3>
            <form onSubmit={handleAddDnsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Target Domain</label>
                <input
                  type="text"
                  required
                  placeholder="login.target.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Redirect IP Address</label>
                <input
                  type="text"
                  required
                  value={newRedirectIp}
                  onChange={(e) => setNewRedirectIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-red-900/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spoof Rule</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 font-mono">Active DNS Spoofing Rules</h3>
              <span className="text-xs font-mono text-slate-400">{dnsRules.length} Rule(s) Configured</span>
            </div>
            <div className="divide-y divide-slate-800/60 font-mono text-sm">
              {dnsRules.map((rule) => (
                <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => onToggleDnsRule(rule.id)}
                      className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-slate-200">{rule.domain}</p>
                      <p className="text-xs text-slate-400">Redirects to IP: <strong className="text-red-400">{rule.redirectIp}</strong></p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteDnsRule(rule.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {dnsRules.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No DNS rules defined. Add a rule above to redirect DNS queries.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'sessions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 font-mono">Captured Web Cookies & Sessions</h3>
            <span className="text-xs font-mono text-red-400">HTTPS Stripping Active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-mono text-slate-400 uppercase">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Cookie Name</th>
                  <th className="py-3 px-4">Cookie Value (Token)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm font-mono">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-400 text-xs">{s.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-200">{s.domain}</td>
                    <td className="py-3 px-4 text-emerald-400">{s.username}</td>
                    <td className="py-3 px-4 text-slate-300">{s.cookieName}</td>
                    <td className="py-3 px-4 text-amber-400 truncate max-w-xs select-all">{s.cookieValue}</td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-sm font-mono">
                      No active sessions hijacked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'redirect' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-100">Real-Time HTTP Traffic Manipulation</h3>
          <p className="text-xs text-slate-400">
            Replace images, inject malicious JavaScript payloads, or redirect URLs on unencrypted HTTP connections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sm text-slate-200 font-mono">Image Replacement Rule</h4>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Image URL Regex</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Replace With Image URL</label>
                <input
                  type="text"
                  value={replaceUrl}
                  onChange={(e) => setReplaceUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                onClick={() => onAddLog('success', 'MITM', `Activated Image Replacement rule for ${targetUrl}`)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition shadow-lg shadow-red-900/40"
              >
                Apply Replacement Rule
              </button>
            </div>

            <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sm text-slate-200 font-mono">JavaScript Injection</h4>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Payload Script</label>
                <textarea
                  rows={4}
                  defaultValue="<script>alert('cSploit Web MITM Injection!');</script>"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                onClick={() => onAddLog('success', 'MITM', 'Injected JavaScript payload into outbound HTML streams.')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition shadow-lg shadow-red-900/40"
              >
                Inject JS Payload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

cat << 'EOF' > src/components/LoginCracker.tsx
import React, { useState } from 'react';
import { Key, Play, Square, Terminal, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoginCrackerProps {
  onAddLog: (level: any, source: string, message: string) => void;
}

export const LoginCracker: React.FC<LoginCrackerProps> = ({ onAddLog }) => {
  const [protocol, setProtocol] = useState<'ssh' | 'ftp' | 'http' | 'telnet' | 'smb'>('ssh');
  const [targetIp, setTargetIp] = useState('192.168.1.1');
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState('root');
  const [wordlist, setWordlist] = useState('rockyou_top100.txt');
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [successResult, setSuccessResult] = useState<string | null>(null);

  const handleStartCracking = () => {
    setIsRunning(true);
    setAttempts(0);
    setSuccessResult(null);
    onAddLog('info', 'Hydra', `Starting brute-force attack against ${targetIp}:${port} (${protocol.toUpperCase()}) using wordlist ${wordlist}...`);

    let current = 0;
    const interval = setInterval(() => {
      current += 12;
      setAttempts(current);
      if (current >= 72) {
        clearInterval(interval);
        setIsRunning(false);
        setSuccessResult('root / password123 (FOUND!)');
        onAddLog('success', 'Hydra', `SUCCESS! Valid credentials found for ${targetIp}: root / password123`);
      }
    }, 300);
  };

  const handleStopCracking = () => {
    setIsRunning(false);
    onAddLog('warn', 'Hydra', 'Brute-force attack aborted by user.');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Key className="w-4 h-4" />
            <span>Hydra Service Login Cracker</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Login Cracker & Brute-Forcer</h2>
          <p className="text-slate-400 text-sm mt-1">
            Perform fast dictionary and brute-force attacks against SSH, FTP, HTTP Basic Auth, Telnet, and SMB services.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 font-mono">Attack Configuration</h3>
          
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Target Protocol</label>
            <select
              value={protocol}
              onChange={(e) => {
                const p = e.target.value as any;
                setProtocol(p);
                if (p === 'ssh') setPort(22);
                if (p === 'ftp') setPort(21);
                if (p === 'http') setPort(80);
                if (p === 'telnet') setPort(23);
                if (p === 'smb') setPort(445);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500 uppercase"
            >
              <option value="ssh">SSH (Port 22)</option>
              <option value="ftp">FTP (Port 21)</option>
              <option value="http">HTTP Basic Auth (Port 80/443)</option>
              <option value="telnet">Telnet (Port 23)</option>
              <option value="smb">SMB (Port 445)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">Target IP</label>
              <input
                type="text"
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Target Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Dictionary Wordlist</label>
            <select
              value={wordlist}
              onChange={(e) => setWordlist(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
            >
              <option value="rockyou_top100.txt">rockyou_top100.txt (100 passwords)</option>
              <option value="router_default_passwords.txt">router_default_passwords.txt (450 passwords)</option>
              <option value="common_credentials.txt">common_credentials.txt (1000 passwords)</option>
            </select>
          </div>

          <div className="pt-2">
            {isRunning ? (
              <button
                onClick={handleStopCracking}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Abort Brute-Force</span>
              </button>
            ) : (
              <button
                onClick={handleStartCracking}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-red-900/40"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Login Cracker</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 font-mono">Attack Live Status</h3>
              <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                isRunning ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isRunning ? 'RUNNING ATTACK...' : successResult ? 'COMPLETED' : 'IDLE'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500">Attempts Tested</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{attempts}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500">Target Service</p>
                <p className="text-lg font-bold text-red-400 mt-1 uppercase">{protocol} :{port}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-500">Result Status</p>
                <p className={`text-sm font-bold mt-2 ${successResult ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {successResult || (isRunning ? 'Testing passwords...' : 'Ready to start')}
                </p>
              </div>
            </div>

            {successResult && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm">Credentials Cracked Successfully!</h4>
                  <p className="font-mono text-xs text-emerald-400/80 mt-0.5">Username: {username} | Password: password123</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-400 mt-6 h-36 overflow-y-auto">
            <p className="text-slate-500">// Hydra attack progress console log</p>
            {isRunning && <p className="text-red-400 mt-1">[+] Trying {username}:password{attempts} on {targetIp}:{port}...</p>}
            {successResult && <p className="text-emerald-400 mt-1">[+] 1 valid login found: {successResult}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

cat << 'EOF' > src/components/WifiKeygen.tsx
import React, { useState } from 'react';
import { Wifi, Key, Play, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { WifiNetwork } from '../types';
import { INITIAL_WIFI } from '../mockData';

interface WifiKeygenProps {
  onAddLog: (level: any, source: string, message: string) => void;
}

export const WifiKeygen: React.FC<WifiKeygenProps> = ({ onAddLog }) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>(INITIAL_WIFI);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork>(INITIAL_WIFI[0]);
  const [cracking, setCracking] = useState(false);
  const [crackedKey, setCrackedKey] = useState<string | null>(null);

  const handleRunKeygen = (net: WifiNetwork) => {
    setSelectedNetwork(net);
    setCracking(true);
    setCrackedKey(null);
    onAddLog('info', 'WiFi Keygen', `Running default key generation algorithm (${net.algorithm}) for ${net.ssid} (${net.bssid})...`);

    setTimeout(() => {
      setCracking(false);
      const key = net.defaultKeys?.[0] || 'TPLINK98765';
      setCrackedKey(key);
      onAddLog('success', 'WiFi Keygen', `Computed default Wi-Fi key for ${net.ssid}: ${key}`);
    }, 1800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Wifi className="w-4 h-4" />
            <span>Wireless Scanner & Default Key Generator</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">WiFi Keygen & Security Audit</h2>
          <p className="text-slate-400 text-sm mt-1">
            Scan nearby wireless access points and compute default WPA/WEP keys using router ESSID/BSSID algorithms.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-200 text-sm font-mono">Discovered Access Points</h3>
            <div className="space-y-2">
              {networks.map((net, idx) => (
                <div
                  key={idx}
                  onClick={() => handleRunKeygen(net)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedNetwork.ssid === net.ssid
                      ? 'bg-red-600/20 border-red-500/50 text-slate-100'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{net.ssid}</span>
                    <span className="text-xs font-mono text-slate-400">{net.encryption}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                    <span>{net.bssid}</span>
                    <span className={net.vulnerable ? 'text-red-400 font-semibold' : 'text-emerald-400'}>
                      {net.vulnerable ? 'Vulnerable' : 'Secure'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedNetwork.ssid}</h3>
                <p className="font-mono text-xs text-slate-400 mt-0.5">BSSID: {selectedNetwork.bssid} | Channel: {selectedNetwork.channel}</p>
              </div>
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                selectedNetwork.vulnerable ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {selectedNetwork.algorithm || 'Standard WPA2'}
              </span>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-sm text-slate-200 font-mono">Default Key Algorithm Analysis</h4>
              <p className="text-xs text-slate-400">
                Many factory routers generate predictable default WPA/WEP passphrases based on the wireless MAC address (BSSID) or SSID hash.
              </p>

              {cracking && (
                <div className="flex items-center space-x-3 text-red-400 font-mono text-sm py-4">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Computing default key combinations...</span>
                </div>
              )}

              {crackedKey && !cracking && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Default Key Computed Successfully!</span>
                  </div>
                  <p className="font-mono text-lg font-bold text-amber-400 select-all bg-slate-900 px-3 py-2 rounded border border-slate-800">
                    {crackedKey}
                  </p>
                </div>
              )}

              {!crackedKey && !cracking && (
                <button
                  onClick={() => handleRunKeygen(selectedNetwork)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-lg text-sm flex items-center space-x-2 transition shadow-lg shadow-red-900/40"
                >
                  <Key className="w-4 h-4" />
                  <span>Calculate Default Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

cat << 'EOF' > src/components/PacketForger.tsx
import React, { useState } from 'react';
import { Zap, Send, Terminal, CheckCircle2 } from 'lucide-react';

interface PacketForgerProps {
  onAddLog: (level: any, source: string, message: string) => void;
}

export const PacketForger: React.FC<PacketForgerProps> = ({ onAddLog }) => {
  const [protocol, setProtocol] = useState<'TCP' | 'UDP' | 'ICMP'>('TCP');
  const [srcIp, setSrcIp] = useState('192.168.1.105');
  const [dstIp, setDstIp] = useState('192.168.1.1');
  const [port, setPort] = useState(80);
  const [payload, setPayload] = useState('GET / HTTP/1.1\r\nHost: target\r\n\r\n');
  const [sentCount, setSentCount] = useState(0);

  const handleSendPacket = (e: React.FormEvent) => {
    e.preventDefault();
    setSentCount(prev => prev + 1);
    onAddLog('success', 'PacketForger', `Crafted and transmitted raw ${protocol} packet from ${srcIp} to ${dstIp}:${port} (${payload.length} bytes).`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Zap className="w-4 h-4" />
            <span>Raw Socket Packet Crafting</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Packet Forger</h2>
          <p className="text-slate-400 text-sm mt-1">
            Forge and transmit custom TCP, UDP, and ICMP network packets for protocol fuzzing and network testing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSendPacket} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-mono">Packet Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Protocol</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP (Ping)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Source IP</label>
              <input
                type="text"
                value={srcIp}
                onChange={(e) => setSrcIp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Destination Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Destination IP</label>
            <input
              type="text"
              value={dstIp}
              onChange={(e) => setDstIp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Packet Payload (ASCII / Hex)</label>
            <textarea
              rows={5}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm flex items-center space-x-2 transition shadow-lg shadow-red-900/40"
          >
            <Send className="w-4 h-4" />
            <span>Transmit Forged Packet</span>
          </button>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 font-mono">Transmission Stats</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono space-y-2">
            <p className="text-xs text-slate-500">Packets Sent</p>
            <p className="text-3xl font-bold text-slate-100">{sentCount}</p>
          </div>
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-400 h-40 overflow-y-auto">
            <p className="text-slate-500">// Socket log</p>
            {sentCount > 0 && <p className="text-emerald-400 mt-1">[+] Successfully transmitted {sentCount} {protocol} packet(s) to {dstIp}.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

cat << 'EOF' > src/components/MetasploitSessions.tsx
import React, { useState } from 'react';
import { Cpu, Terminal, Play, Square, CheckCircle2, Server, Trash2 } from 'lucide-react';
import { MsfSession } from '../types';
import { INITIAL_MSF_SESSIONS } from '../mockData';

interface MetasploitSessionsProps {
  onAddLog: (level: any, source: string, message: string) => void;
}

export const MetasploitSessions: React.FC<MetasploitSessionsProps> = ({ onAddLog }) => {
  const [sessions, setSessions] = useState<MsfSession[]>(INITIAL_MSF_SESSIONS);
  const [activeSession, setActiveSession] = useState<MsfSession | null>(sessions[0] || null);
  const [shellInput, setShellInput] = useState('');
  const [shellOutput, setShellOutput] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19042.928]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'C:\\Windows\\system32> whoami',
    'nt authority\\system',
    ''
  ]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput) return;
    const cmd = shellInput;
    setShellOutput(prev => [...prev, `C:\\Windows\\system32> ${cmd}`, `Executed command successfully: output returned for ${cmd}`]);
    setShellInput('');
    onAddLog('info', 'Metasploit', `Executed shell command on session #${activeSession?.id}: ${cmd}`);
  };

  const handleKillSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSession?.id === id) setActiveSession(null);
    onAddLog('warn', 'Metasploit', `Terminated MSF session #${id}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" />
            <span>Metasploit Framework RPC Daemon</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Metasploit Sessions & Shell</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage active reverse shell connections, execute remote commands, and control MSF RPC daemon.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">RPCd: <strong className="text-emerald-400">Connected (55553)</strong></span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 font-mono">Active Exploitation Sessions</h3>
          <span className="text-xs font-mono text-slate-400">{sessions.length} Active Session(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Tunnel Connection</th>
                <th className="py-3 px-4">Via Exploit Module</th>
                <th className="py-3 px-4">Target IP</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm font-mono">
              {sessions.map((s) => (
                <tr 
                  key={s.id} 
                  className={`hover:bg-slate-800/40 transition cursor-pointer ${activeSession?.id === s.id ? 'bg-slate-800/60' : ''}`}
                  onClick={() => setActiveSession(s)}
                >
                  <td className="py-3 px-4 font-bold text-red-400">#{s.id}</td>
                  <td className="py-3 px-4 text-slate-200 uppercase text-xs font-semibold">{s.type}</td>
                  <td className="py-3 px-4 text-slate-300 text-xs">{s.tunnel}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs truncate max-w-xs">{s.viaExploit}</td>
                  <td className="py-3 px-4 text-emerald-400">{s.target}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKillSession(s.id);
                      }}
                      className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded transition"
                      title="Terminate Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm font-mono">
                    No active Metasploit sessions. Launch an exploit to obtain a shell session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeSession && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs text-slate-300">
              <Terminal className="w-4 h-4 text-red-500" />
              <span>Interactive Shell -- Session #{activeSession.id} ({activeSession.target})</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">CONNECTED</span>
          </div>
          
          <div className="p-4 font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-1">
            {shellOutput.map((line, idx) => (
              <p key={idx} className={line.startsWith('C:\\') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                {line}
              </p>
            ))}
          </div>

          <form onSubmit={handleSendCommand} className="bg-slate-900 border-t border-slate-800 p-3 flex items-center space-x-2">
            <span className="text-red-500 font-mono text-sm pl-2">&gt;</span>
            <input
              type="text"
              placeholder="Enter shell command (e.g., sysinfo, hashdump, whoami)..."
              value={shellInput}
              onChange={(e) => setShellInput(e.target.value)}
              className="flex-1 bg-transparent font-mono text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1.5 rounded-lg text-xs transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

cat << 'EOF' > src/components/ConsoleLogs.tsx
import React, { useState } from 'react';
import { Terminal, Trash2, Download, Filter } from 'lucide-react';
import { ConsoleLog } from '../types';

interface ConsoleLogsProps {
  logs: ConsoleLog[];
  onClearLogs: () => void;
}

export const ConsoleLogs: React.FC<ConsoleLogsProps> = ({ logs, onClearLogs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredLogs = logs.filter(l => filterLevel === 'all' || l.level === filterLevel);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Terminal className="w-4 h-4" />
            <span>Real-Time System Log & Terminal Output</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Terminal Console</h2>
          <p className="text-slate-400 text-sm mt-1">
            Monitor background tool execution outputs, packet dumps, MITM status events, and debug logs.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClearLogs}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-mono text-slate-300">Filter Level:</span>
        {['all', 'info', 'success', 'warn', 'exploit'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilterLevel(lvl)}
            className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition ${
              filterLevel === lvl
                ? 'bg-red-600 text-white font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <span>cSploit Web Console Output</span>
          <span>{filteredLogs.length} events logged</span>
        </div>
        <div className="p-4 h-[500px] overflow-y-auto space-y-2">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 border-b border-slate-900 pb-2">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                log.level === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                log.level === 'warn' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                log.level === 'exploit' ? 'bg-red-600 text-white font-bold' :
                'bg-slate-800 text-slate-300'
              }`}>
                {log.source}
              </span>
              <span className={`flex-1 ${
                log.level === 'success' ? 'text-emerald-400' :
                log.level === 'warn' ? 'text-amber-400' :
                log.level === 'exploit' ? 'text-red-400 font-bold' :
                'text-slate-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              No console logs matching filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
