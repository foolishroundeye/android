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
