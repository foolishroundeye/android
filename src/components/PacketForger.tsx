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
