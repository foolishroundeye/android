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
