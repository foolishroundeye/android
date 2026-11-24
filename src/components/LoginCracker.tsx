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
