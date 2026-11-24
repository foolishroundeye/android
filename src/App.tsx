import React, { useState } from 'react';
import { TabType, Host, SniffedCredential, DnsRule, HijackedSession, ConsoleLog } from './types';
import { 
  INITIAL_HOSTS, 
  INITIAL_CREDENTIALS, 
  INITIAL_DNS_RULES, 
  INITIAL_SESSIONS, 
  INITIAL_LOGS, 
  INITIAL_MSF_SESSIONS 
} from './mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NetworkRadar } from './components/NetworkRadar';
import { PortScanner } from './components/PortScanner';
import { VulnerabilityFinder } from './components/VulnerabilityFinder';
import { MitmFramework } from './components/MitmFramework';
import { LoginCracker } from './components/LoginCracker';
import { WifiKeygen } from './components/WifiKeygen';
import { PacketForger } from './components/PacketForger';
import { MetasploitSessions } from './components/MetasploitSessions';
import { ConsoleLogs } from './components/ConsoleLogs';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('radar');
  const [hosts, setHosts] = useState<Host[]>(INITIAL_HOSTS);
  const [credentials, setCredentials] = useState<SniffedCredential[]>(INITIAL_CREDENTIALS);
  const [dnsRules, setDnsRules] = useState<DnsRule[]>(INITIAL_DNS_RULES);
  const [sessions, setSessions] = useState<HijackedSession[]>(INITIAL_SESSIONS);
  const [logs, setLogs] = useState<ConsoleLog[]>(INITIAL_LOGS);
  const [mitmActive, setMitmActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedHost, setSelectedHost] = useState<Host | null>(INITIAL_HOSTS[0]);

  const addLog = (level: 'info' | 'success' | 'warn' | 'error' | 'exploit', source: string, message: string) => {
    const newLog: ConsoleLog = {
      id: 'l_' + Date.now() + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toLocaleTimeString(),
      level,
      source,
      message
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleScanSubnet = () => {
    setIsScanning(true);
    addLog('info', 'Radar', 'Initiated ARP ping subnet scan on 192.168.1.0/24...');
    setTimeout(() => {
      setIsScanning(false);
      addLog('success', 'Radar', `Subnet scan completed. Found ${hosts.length} active hosts.`);
    }, 2000);
  };

  const handleToggleMitm = () => {
    const nextState = !mitmActive;
    setMitmActive(nextState);
    if (nextState) {
      addLog('warn', 'MITM', 'ARP spoofing engine armed. Intercepting traffic on interface wlan0.');
    } else {
      addLog('info', 'MITM', 'ARP spoofing engine disarmed. Network restored to normal.');
    }
  };

  const handleAddHost = (newHost: Host) => {
    setHosts(prev => [newHost, ...prev]);
    addLog('success', 'Radar', `Added custom remote host: ${newHost.ip} (${newHost.hostname})`);
  };

  const handleAddDnsRule = (rule: DnsRule) => {
    setDnsRules(prev => [rule, ...prev]);
  };

  const handleToggleDnsRule = (id: string) => {
    setDnsRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDeleteDnsRule = (id: string) => {
    setDnsRules(prev => prev.filter(r => r.id !== id));
  };

  const totalVulnsCount = hosts.reduce((acc, h) => acc + h.vulnerabilities.length, 0);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hostsCount={hosts.length}
        vulnsCount={totalVulnsCount}
        sessionsCount={INITIAL_MSF_SESSIONS.length}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          mitmActive={mitmActive}
          onToggleMitm={handleToggleMitm}
          onScanNetwork={handleScanSubnet}
          isScanning={isScanning}
          logsCount={logs.filter(l => l.level === 'exploit' || l.level === 'warn').length}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'radar' && (
            <NetworkRadar
              hosts={hosts}
              onScan={handleScanSubnet}
              isScanning={isScanning}
              onSelectHostForScan={(host) => {
                setSelectedHost(host);
                setActiveTab('ports');
              }}
              onAddHost={handleAddHost}
            />
          )}

          {activeTab === 'ports' && (
            <PortScanner
              hosts={hosts}
              selectedHost={selectedHost}
              onSelectHost={setSelectedHost}
            />
          )}

          {activeTab === 'vulnerabilities' && (
            <VulnerabilityFinder
              hosts={hosts}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'mitm' && (
            <MitmFramework
              mitmActive={mitmActive}
              onToggleMitm={handleToggleMitm}
              credentials={credentials}
              dnsRules={dnsRules}
              onAddDnsRule={handleAddDnsRule}
              onToggleDnsRule={handleToggleDnsRule}
              onDeleteDnsRule={handleDeleteDnsRule}
              sessions={sessions}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'cracker' && (
            <LoginCracker onAddLog={addLog} />
          )}

          {activeTab === 'wifi' && (
            <WifiKeygen onAddLog={addLog} />
          )}

          {activeTab === 'forger' && (
            <PacketForger onAddLog={addLog} />
          )}

          {activeTab === 'metasploit' && (
            <MetasploitSessions onAddLog={addLog} />
          )}

          {activeTab === 'console' && (
            <ConsoleLogs
              logs={logs}
              onClearLogs={() => setLogs([])}
            />
          )}
        </main>
      </div>
    </div>
  );
}
