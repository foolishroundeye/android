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
