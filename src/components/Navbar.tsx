import React from 'react';
import { Shield, Terminal, Wifi, Cpu, AlertTriangle, Settings, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: any) => void;
  mitmActive: boolean;
  onToggleMitm: () => void;
  onScanNetwork: () => void;
  isScanning: boolean;
  logsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  mitmActive,
  onToggleMitm,
  onScanNetwork,
  isScanning,
  logsCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-900/40 flex items-center justify-center">
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
              cSploit <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono">v1.7.0 Web</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">Advanced Network Security & Penetration Testing Suite</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">wlan0:</span>
          <span className="text-emerald-400 font-bold">192.168.1.105</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Gateway:</span>
          <span className="text-slate-200">192.168.1.1</span>
        </div>

        <button
          onClick={onToggleMitm}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
            mitmActive 
              ? 'bg-red-600/20 border border-red-500/50 text-red-400 shadow-lg shadow-red-900/30 animate-pulse' 
              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${mitmActive ? 'bg-red-500' : 'bg-slate-500'}`} />
          <span>MITM Engine: {mitmActive ? 'ARMED' : 'OFF'}</span>
        </button>

        <button
          onClick={onScanNetwork}
          disabled={isScanning}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition shadow-md shadow-red-900/30 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isScanning ? 'Scanning Subnet...' : 'Scan Subnet'}</span>
        </button>

        <button
          onClick={() => onSelectTab('console')}
          className={`relative p-2 rounded-lg border transition ${
            activeTab === 'console'
              ? 'bg-red-600/20 border-red-500 text-red-400'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
          title="Terminal Console & Logs"
        >
          <Terminal className="w-4 h-4" />
          {logsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {logsCount > 9 ? '9+' : logsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
