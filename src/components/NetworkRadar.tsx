import React, { useState } from 'react';
import { Host } from '../types';
import { 
  Wifi, 
  Router, 
  Smartphone, 
  Laptop, 
  Server, 
  ShieldAlert, 
  Search, 
  Play, 
  Plus, 
  Terminal, 
  Lock, 
  CheckCircle2,
  Cpu,
  Globe
} from 'lucide-react';

interface NetworkRadarProps {
  hosts: Host[];
  onScan: () => void;
  isScanning: boolean;
  onSelectHostForScan: (host: Host) => void;
  onAddHost: (host: Host) => void;
}

export const NetworkRadar: React.FC<NetworkRadarProps> = ({
  hosts,
  onScan,
  isScanning,
  onSelectHostForScan,
  onAddHost
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIp, setNewIp] = useState('192.168.1.');
  const [newHostname, setNewHostname] = useState('');

  const filteredHosts = hosts.filter(h => 
    h.ip.includes(searchTerm) || 
    h.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHostIcon = (host: Host) => {
    if (host.isRouter) return <Router className="w-5 h-5 text-red-500" />;
    if (host.os.toLowerCase().includes('android') || host.os.toLowerCase().includes('ios')) return <Smartphone className="w-5 h-5 text-blue-400" />;
    if (host.vendor.toLowerCase().includes('raspberry') || host.os.toLowerCase().includes('linux')) return <Server className="w-5 h-5 text-amber-400" />;
    return <Laptop className="w-5 h-5 text-slate-300" />;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp) return;
    const newHost: Host = {
      id: 'h_' + Date.now(),
      ip: newIp,
      mac: 'AA:BB:CC:DD:EE:FF',
      hostname: newHostname || 'custom-host.local',
      vendor: 'Unknown / Custom',
      os: 'Generic TCP/IP',
      status: 'online',
      isRouter: false,
      isSelf: false,
      ports: [
        { port: 80, protocol: 'tcp', service: 'http', state: 'open' },
        { port: 443, protocol: 'tcp', service: 'https', state: 'open' }
      ],
      vulnerabilities: []
    };
    onAddHost(newHost);
    setShowAddModal(false);
    setNewIp('192.168.1.');
    setNewHostname('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
            <Wifi className="w-4 h-4 animate-pulse" />
            <span>Subnet Radar: 192.168.1.0/24</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Discovered Network Hosts</h2>
          <p className="text-slate-400 text-sm mt-1">
            Map local network devices, fingerprint operating systems, check open ports and inspect security postures.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Host</span>
          </button>
          <button
            onClick={onScan}
            disabled={isScanning}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition shadow-lg shadow-red-900/40 disabled:opacity-50"
          >
            <Search className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Network...' : 'Scan Subnet'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by IP, MAC, hostname or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
          Total Hosts: <span className="text-red-400 font-bold">{filteredHosts.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHosts.map((host) => (
          <div
            key={host.id}
            className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition group hover:border-slate-700 ${
              host.isSelf ? 'border-blue-500/40 bg-slate-900/90' : host.isRouter ? 'border-red-500/40' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${host.isRouter ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                    {getHostIcon(host)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-100 text-base">{host.hostname}</h3>
                      {host.isSelf && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">YOU</span>}
                      {host.isRouter && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono">GATEWAY</span>}
                    </div>
                    <p className="font-mono text-xs text-red-400 font-semibold">{host.ip}</p>
                  </div>
                </div>
                <span className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{host.status}</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 font-mono my-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">MAC:</span>
                  <span className="text-slate-300">{host.mac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendor:</span>
                  <span className="text-slate-300 truncate max-w-[180px]">{host.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">OS:</span>
                  <span className="text-slate-300 truncate max-w-[180px]">{host.os}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Ports: {host.ports.length}
                </span>
                {host.vulnerabilities.length > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>{host.vulnerabilities.length} Vuln(s)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectHostForScan(host)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <span>Port Scan</span>
              </button>
              <button
                onClick={() => onSelectHostForScan(host)}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-500" />
              <span>Add Custom Remote Host</span>
            </h3>
            <p className="text-xs text-slate-400">
              Add a target outside your local subnet for remote scanning and exploit assessment.
            </p>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">IP Address</label>
                <input
                  type="text"
                  required
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Hostname (Optional)</label>
                <input
                  type="text"
                  placeholder="target.domain.com"
                  value={newHostname}
                  onChange={(e) => setNewHostname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-red-900/40"
                >
                  Add Host
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
