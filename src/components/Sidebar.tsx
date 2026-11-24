import React from 'react';
import { 
  Radar, 
  Search, 
  AlertOctagon, 
  Eye, 
  Key, 
  Wifi, 
  Cpu, 
  Terminal, 
  Zap, 
  Layers,
  ShieldAlert
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  hostsCount: number;
  vulnsCount: number;
  sessionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  hostsCount,
  vulnsCount,
  sessionsCount
}) => {
  const navItems = [
    { id: 'radar' as TabType, label: 'Network Radar', icon: Radar, badge: hostsCount },
    { id: 'ports' as TabType, label: 'Port Scanner', icon: Search },
    { id: 'vulnerabilities' as TabType, label: 'Vulnerability Finder', icon: ShieldAlert, badge: vulnsCount, badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { id: 'mitm' as TabType, label: 'MITM Framework', icon: Eye, highlight: true },
    { id: 'cracker' as TabType, label: 'Login Cracker', icon: Key },
    { id: 'wifi' as TabType, label: 'WiFi Keygen', icon: Wifi },
    { id: 'forger' as TabType, label: 'Packet Forger', icon: Zap },
    { id: 'metasploit' as TabType, label: 'Metasploit RPC', icon: Cpu, badge: sessionsCount, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'console' as TabType, label: 'Terminal Logs', icon: Terminal },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      <div className="p-3 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
        Toolbox Navigation
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition group ${
                isActive
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-xs font-mono text-slate-400">
        <div className="flex justify-between items-center mb-1">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-bold">ONLINE</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Modern Web App:</span>
          <span className="text-red-400 font-bold">READY</span>
        </div>
      </div>
    </aside>
  );
};
