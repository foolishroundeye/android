import React, { useState } from 'react';
import { Host, PortInfo } from '../types';
import { Search, ShieldAlert, CheckCircle, Terminal, Play, Cpu, RefreshCw, Server } from 'lucide-react';

interface PortScannerProps {
  hosts: Host[];
  selectedHost: Host | null;
  onSelectHost: (host: Host) => void;
}

export const PortScanner: React.FC<PortScannerProps> = ({
  hosts,
  selectedHost,
  onSelectHost
}) => {
  const [targetIp, setTargetIp] = useState(selectedHost ? selectedHost.ip : hosts[0]?.ip || '192.168.1.1');
  const [scanType, setScanType] = useState<'quick' | 'full' | 'custom'>('quick');
  const [isScanning, setIsScanning] = useState(false);
  const [ports, setPorts] = useState<PortInfo[]>(
    hosts.find(h => h.ip === targetIp)?.ports || [
      { port: 22, protocol: 'tcp', service: 'ssh', state: 'open', version: 'OpenSSH' },
      { port: 80, protocol: 'tcp', service: 'http', state: 'open', version: 'nginx' },
      { port: 443, protocol: 'tcp', service: 'https', state: 'open', version: 'nginx/SSL' }
    ]
  );

  const handleRunScan = () => {
    setIsScanning(true);
    const host = hosts.find(h => h.ip === targetIp);
    setTimeout(() => {
      if (host) {
        setPorts(host.ports);
      } else {
        setPorts([
          { port: 21, protocol: 'tcp', service: 'ftp', state: 'open', version: 'vsftpd 3.0.3' },
          { port: 22, protocol: 'tcp', service: 'ssh', state: 'open', version: 'OpenSSH 8.2p1' },
          { port: 80, protocol: 'tcp', service: 'http', state: 'open', version: 'Apache 2.4.41' },
          { port: 443, protocol: 'tcp', service: 'https', state: 'open' },
          { port: 3306, protocol: 'tcp', service: 'mysql', state: 'open', version: 'MySQL 8.0.25' }
        ]);
      }
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Search className="w-4 h-4" />
            <span>Port Scanning & Service Fingerprinting</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">TCP/UDP Port Scanner</h2>
          <p className="text-slate-400 text-sm mt-1">
            Probe listening services, banner grab versions, and identify potential entry vectors on target nodes.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Target Host / IP</label>
            <select
              value={targetIp}
              onChange={(e) => {
                setTargetIp(e.target.value);
                const h = hosts.find(x => x.ip === e.target.value);
                if (h) {
                  onSelectHost(h);
                  setPorts(h.ports);
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
            >
              {hosts.map(h => (
                <option key={h.id} value={h.ip}>
                  {h.ip} ({h.hostname})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Scan Profile</label>
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-red-500"
            >
              <option value="quick">Quick Scan (Top 100 Common Ports)</option>
              <option value="full">Full SYN Scan (Ports 1-65535)</option>
              <option value="custom">Custom Service Fingerprint</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-red-900/40 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Ports...' : 'Start Port Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <Server className="w-4 h-4 text-red-500" />
            <span>Target: <strong className="text-red-400">{targetIp}</strong></span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Open Ports: <span className="text-emerald-400 font-bold">{ports.filter(p => p.state === 'open').length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Port</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Version & Banner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm font-mono">
              {ports.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-red-400">{p.port}</td>
                  <td className="py-3 px-4 uppercase text-xs text-slate-400">{p.protocol}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      p.state === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.state === 'open' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{p.state}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{p.service}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs">{p.version || 'Unknown / Standard'}</td>
                </tr>
              ))}
              {ports.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-sm font-mono">
                    No open ports found on target. Run a port scan to populate results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
