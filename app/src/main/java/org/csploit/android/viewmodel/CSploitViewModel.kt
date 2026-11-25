package org.csploit.android.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.csploit.android.data.InitialData
import org.csploit.android.model.*
import org.csploit.android.network.NetworkDiagnostics
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class CSploitUiState(
    val activeTab: ToolTab = ToolTab.RADAR,
    val localInterface: LocalInterfaceSummary = LocalInterfaceSummary(
        interfaceName = "wlan0",
        ipAddress = "192.168.1.105",
        gatewayIp = "192.168.1.1",
        subnetCidr = "192.168.1.0/24",
        dnsServers = listOf("1.1.1.1", "8.8.8.8"),
        isRooted = false
    ),
    val hosts: List<HostItem> = InitialData.hosts,
    val selectedHostId: String = InitialData.hosts.first().id,
    val isScanningSubnet: Boolean = false,
    val portScanResults: List<PortEntry> = InitialData.hosts.first().ports,
    val isScanningPorts: Boolean = false,
    val exploitedVulnIds: Set<String> = emptySet(),
    val exploitingVulnId: String? = null,
    val mitmActive: Boolean = false,
    val credentials: List<SniffedCredential> = InitialData.credentials,
    val dnsRules: List<DnsSpoofRule> = InitialData.dnsRules,
    val hijackedSessions: List<HijackedSession> = InitialData.hijackedSessions,
    val wifiNetworks: List<WifiAccessPoint> = InitialData.wifiNetworks,
    val selectedWifiBssid: String = InitialData.wifiNetworks.first().bssid,
    val computedWifiKeys: List<String> = emptyList(),
    val isCrackingWifi: Boolean = false,
    val isCrackingLogin: Boolean = false,
    val loginAttempts: Int = 0,
    val loginFoundResult: String? = null,
    val packetsSentCount: Int = 0,
    val lastPacketStatus: String = "",
    val msfSessions: List<MsfSessionItem> = InitialData.msfSessions,
    val selectedMsfSessionId: Int? = InitialData.msfSessions.firstOrNull()?.id,
    val shellLines: List<String> = listOf(
        "cSploit MSF RPC Bridge [v2.0.0]",
        "Connected to session #1 (192.168.1.112)",
        "Type 'help' for built-in commands.",
        ""
    ),
    val logs: List<ConsoleLogEntry> = InitialData.logs,
    val tlsReport: TlsCertReport? = null,
    val isInspectingTls: Boolean = false,
    val httpReport: HttpAuditReport? = null,
    val isAuditingHttp: Boolean = false,
    val pingSamples: List<PingSample> = emptyList(),
    val isPinging: Boolean = false
) {
    val selectedHost: HostItem?
        get() = hosts.firstOrNull { it.id == selectedHostId } ?: hosts.firstOrNull()
}

class CSploitViewModel(application: Application) : AndroidViewModel(application) {
    private val _uiState = MutableStateFlow(CSploitUiState())
    val uiState: StateFlow<CSploitUiState> = _uiState.asStateFlow()

    private var crackerJob: Job? = null
    private var pingJob: Job? = null
    private val timeFmt = SimpleDateFormat("HH:mm:ss", Locale.US)

    init {
        refreshLocalInterface()
    }

    fun refreshLocalInterface() {
        val summary = NetworkDiagnostics.detectLocalInterface(getApplication())
        _uiState.update { state ->
            val updatedHosts = state.hosts.map { host ->
                when {
                    host.isSelf -> host.copy(ip = summary.ipAddress)
                    host.isRouter -> host.copy(ip = summary.gatewayIp)
                    else -> host
                }
            }
            state.copy(
                localInterface = summary,
                hosts = updatedHosts
            )
        }
        addLog(
            LogLevel.INFO,
            "NetCore",
            "Detected ${summary.interfaceName}: ${summary.ipAddress} (GW ${summary.gatewayIp}, Root: ${if (summary.isRooted) "Yes" else "User-space"})"
        )
    }

    fun selectTab(tab: ToolTab) {
        _uiState.update { it.copy(activeTab = tab) }
    }

    fun selectHost(host: HostItem, jumpToTab: ToolTab? = null) {
        _uiState.update {
            it.copy(
                selectedHostId = host.id,
                portScanResults = host.ports,
                activeTab = jumpToTab ?: it.activeTab
            )
        }
    }

    fun addCustomHost(ip: String, hostname: String) {
        val cleanIp = ip.trim()
        if (cleanIp.isBlank()) return
        val newHost = HostItem(
            id = "h_${System.currentTimeMillis()}",
            ip = cleanIp,
            mac = "AA:BB:CC:DD:EE:FF",
            hostname = hostname.trim().ifBlank { cleanIp },
            vendor = "Custom Remote Target",
            os = "TCP/IP Endpoint",
            online = true,
            ports = listOf(
                PortEntry(80, "tcp", "http", PortState.OPEN),
                PortEntry(443, "tcp", "https", PortState.OPEN)
            )
        )
        _uiState.update {
            it.copy(
                hosts = listOf(newHost) + it.hosts,
                selectedHostId = newHost.id,
                portScanResults = newHost.ports
            )
        }
        addLog(LogLevel.SUCCESS, "Radar", "Added target host $cleanIp (${newHost.hostname})")
    }

    fun scanSubnet() {
        if (_uiState.value.isScanningSubnet) return
        val subnet = _uiState.value.localInterface.subnetCidr
        _uiState.update { it.copy(isScanningSubnet = true) }
        addLog(LogLevel.INFO, "Radar", "Scanning subnet $subnet (ARP + TCP discovery)...")

        viewModelScope.launch {
            refreshLocalInterface()
            val gatewayIp = _uiState.value.localInterface.gatewayIp
            // Real quick probe on gateway port 80/443 to enrich host state without blocking
            val probe80 = NetworkDiagnostics.probeTcpPort(gatewayIp, 80, 400)
            delay(900)
            _uiState.update { state ->
                val updatedHosts = state.hosts.map { h ->
                    if (h.isRouter && probe80.state == PortState.OPEN) {
                        val merged = (listOf(probe80) + h.ports.filterNot { it.port == 80 })
                            .sortedBy { it.port }
                        h.copy(ports = merged)
                    } else h
                }
                state.copy(isScanningSubnet = false, hosts = updatedHosts)
            }
            addLog(LogLevel.SUCCESS, "Radar", "Subnet discovery finished: ${_uiState.value.hosts.size} hosts online.")
        }
    }

    fun runPortScan(targetIp: String, profile: String, liveSocketProbe: Boolean) {
        if (_uiState.value.isScanningPorts) return
        _uiState.update { it.copy(isScanningPorts = true) }
        addLog(
            LogLevel.INFO,
            "PortScanner",
            "Starting ${if (liveSocketProbe) "LIVE TCP socket" else profile} scan on $targetIp..."
        )

        viewModelScope.launch {
            val results: List<PortEntry> = if (liveSocketProbe) {
                val probePorts = when (profile) {
                    "Full Common (18 Ports)" -> listOf(21, 22, 23, 25, 53, 80, 110, 139, 143, 443, 445, 3000, 3306, 3389, 5555, 8000, 8080, 8443)
                    else -> listOf(21, 22, 53, 80, 443, 445, 3000, 5555, 8080)
                }
                probePorts.map { port -> NetworkDiagnostics.probeTcpPort(targetIp, port, 450) }
                    .filter { it.state == PortState.OPEN || it.state == PortState.FILTERED }
            } else {
                delay(900)
                val existing = _uiState.value.hosts.firstOrNull { it.ip == targetIp }?.ports
                if (!existing.isNullOrEmpty()) {
                    existing
                } else {
                    listOf(
                        PortEntry(22, "tcp", "ssh", PortState.OPEN, "OpenSSH 8.9p1"),
                        PortEntry(80, "tcp", "http", PortState.OPEN, "nginx 1.24.0"),
                        PortEntry(443, "tcp", "https", PortState.OPEN, "OpenSSL 3.0")
                    )
                }
            }

            _uiState.update { state ->
                val updatedHosts = state.hosts.map { h ->
                    if (h.ip == targetIp && results.isNotEmpty()) h.copy(ports = results) else h
                }
                state.copy(
                    isScanningPorts = false,
                    portScanResults = results,
                    hosts = updatedHosts
                )
            }
            addLog(
                LogLevel.SUCCESS,
                "PortScanner",
                "Scan complete for $targetIp: ${results.count { it.state == PortState.OPEN }} open port(s) found."
            )
        }
    }

    fun launchExploit(host: HostItem, vuln: VulnerabilityEntry) {
        if (_uiState.value.exploitingVulnId != null) return
        _uiState.update { it.copy(exploitingVulnId = vuln.id) }
        val module = vuln.moduleName ?: "exploit/multi/handler"
        addLog(LogLevel.EXPLOIT, "Metasploit", "Launching $module against ${host.ip} (${vuln.cve})...")

        viewModelScope.launch {
            delay(1400)
            val nextId = (_uiState.value.msfSessions.maxOfOrNull { it.id } ?: 0) + 1
            val newSession = MsfSessionItem(
                id = nextId,
                type = "shell",
                tunnel = "${_uiState.value.localInterface.ipAddress}:4444 -> ${host.ip}:${38000 + nextId}",
                viaExploit = module,
                viaPayload = "payload/cmd/unix/reverse_bash",
                target = host.ip,
                active = true
            )
            _uiState.update {
                it.copy(
                    exploitingVulnId = null,
                    exploitedVulnIds = it.exploitedVulnIds + vuln.id,
                    msfSessions = it.msfSessions + newSession,
                    selectedMsfSessionId = nextId
                )
            }
            addLog(LogLevel.SUCCESS, "Metasploit", "Session #$nextId opened on ${host.ip} via ${vuln.cve}!")
        }
    }

    fun toggleMitm() {
        val next = !_uiState.value.mitmActive
        _uiState.update { it.copy(mitmActive = next) }
        if (next) {
            addLog(LogLevel.WARN, "MITM", "ARP & traffic interception engine ARMED on ${_uiState.value.localInterface.interfaceName}.")
            viewModelScope.launch {
                delay(1500)
                if (_uiState.value.mitmActive) {
                    val captured = SniffedCredential(
                        id = "c_${System.currentTimeMillis()}",
                        timestamp = nowTime(),
                        protocol = "HTTP",
                        targetIp = _uiState.value.hosts.firstOrNull { !it.isSelf && !it.isRouter }?.ip ?: "192.168.1.112",
                        username = "operator",
                        password = "Spring2026!Audit",
                        details = "POST /api/auth HTTP/1.1 (Intercepted)"
                    )
                    _uiState.update { it.copy(credentials = listOf(captured) + it.credentials) }
                    addLog(LogLevel.EXPLOIT, "Sniffer", "Captured HTTP credentials for ${captured.username}@${captured.targetIp}")
                }
            }
        } else {
            addLog(LogLevel.INFO, "MITM", "ARP spoofing disarmed; routing tables restored.")
        }
    }

    fun addDnsRule(domain: String, redirectIp: String) {
        val cleanDomain = domain.trim()
        val cleanIp = redirectIp.trim()
        if (cleanDomain.isBlank() || cleanIp.isBlank()) return
        val rule = DnsSpoofRule("d_${System.currentTimeMillis()}", cleanDomain, cleanIp, true)
        _uiState.update { it.copy(dnsRules = listOf(rule) + it.dnsRules) }
        addLog(LogLevel.SUCCESS, "DNS Spoof", "Added rule: $cleanDomain -> $cleanIp")
    }

    fun toggleDnsRule(id: String) {
        _uiState.update { state ->
            state.copy(dnsRules = state.dnsRules.map { if (it.id == id) it.copy(enabled = !it.enabled) else it })
        }
    }

    fun deleteDnsRule(id: String) {
        _uiState.update { state ->
            state.copy(dnsRules = state.dnsRules.filterNot { it.id == id })
        }
    }

    fun applyTrafficInjection(ruleSummary: String) {
        addLog(LogLevel.SUCCESS, "MITM Inject", ruleSummary)
    }

    fun startLoginCracker(protocol: String, targetIp: String, port: Int, username: String, wordlist: String) {
        crackerJob?.cancel()
        _uiState.update { it.copy(isCrackingLogin = true, loginAttempts = 0, loginFoundResult = null) }
        addLog(LogLevel.INFO, "Hydra", "Starting $protocol dictionary audit on $targetIp:$port ($wordlist)...")

        crackerJob = viewModelScope.launch {
            for (step in 1..6) {
                delay(280)
                _uiState.update { it.copy(loginAttempts = step * 14) }
            }
            val found = "$username / password123"
            _uiState.update { it.copy(isCrackingLogin = false, loginFoundResult = found) }
            addLog(LogLevel.SUCCESS, "Hydra", "Valid login discovered on $targetIp:$port -> $found")
        }
    }

    fun stopLoginCracker() {
        crackerJob?.cancel()
        _uiState.update { it.copy(isCrackingLogin = false) }
        addLog(LogLevel.WARN, "Hydra", "Login audit stopped by user.")
    }

    fun calculateWifiKeys(ap: WifiAccessPoint) {
        _uiState.update { it.copy(selectedWifiBssid = ap.bssid, isCrackingWifi = true, computedWifiKeys = emptyList()) }
        addLog(LogLevel.INFO, "WiFi Keygen", "Running ${ap.algorithm} for ${ap.ssid} (${ap.bssid})...")

        viewModelScope.launch {
            delay(750)
            val keys = NetworkDiagnostics.calculateRouterDefaultKeys(ap)
            _uiState.update { it.copy(isCrackingWifi = false, computedWifiKeys = keys) }
            addLog(LogLevel.SUCCESS, "WiFi Keygen", "Derived ${keys.size} candidate key(s) for ${ap.ssid}.")
        }
    }

    fun refreshWifiScan() {
        addLog(LogLevel.INFO, "WiFi", "Refreshed nearby wireless BSSID table (${_uiState.value.wifiNetworks.size} APs).")
    }

    fun sendForgedPacket(protocol: String, srcIp: String, dstIp: String, port: Int, payload: String, realUdpSend: Boolean) {
        viewModelScope.launch {
            if (realUdpSend && protocol == "UDP") {
                val res = NetworkDiagnostics.sendUdpPacket(dstIp, port, payload)
                res.onSuccess { bytes ->
                    _uiState.update {
                        it.copy(
                            packetsSentCount = it.packetsSentCount + 1,
                            lastPacketStatus = "Real UDP datagram ($bytes bytes) sent to $dstIp:$port"
                        )
                    }
                    addLog(LogLevel.SUCCESS, "PacketForger", "Real UDP packet ($bytes bytes) dispatched to $dstIp:$port")
                }.onFailure { err ->
                    _uiState.update {
                        it.copy(lastPacketStatus = "UDP send error: ${err.message}")
                    }
                    addLog(LogLevel.ERROR, "PacketForger", "UDP socket error: ${err.message}")
                }
            } else {
                _uiState.update {
                    it.copy(
                        packetsSentCount = it.packetsSentCount + 1,
                        lastPacketStatus = "Crafted $protocol frame ($srcIp -> $dstIp:$port, ${payload.length} bytes)"
                    )
                }
                addLog(LogLevel.SUCCESS, "PacketForger", "Transmitted forged $protocol packet to $dstIp:$port (${payload.length} bytes).")
            }
        }
    }

    fun selectMsfSession(id: Int) {
        _uiState.update { it.copy(selectedMsfSessionId = id) }
    }

    fun killMsfSession(id: Int) {
        _uiState.update { state ->
            val remaining = state.msfSessions.filterNot { it.id == id }
            state.copy(
                msfSessions = remaining,
                selectedMsfSessionId = if (state.selectedMsfSessionId == id) remaining.firstOrNull()?.id else state.selectedMsfSessionId
            )
        }
        addLog(LogLevel.WARN, "Metasploit", "Terminated session #$id")
    }

    fun runShellCommand(command: String) {
        val cmd = command.trim()
        if (cmd.isBlank()) return
        val session = _uiState.value.msfSessions.firstOrNull { it.id == _uiState.value.selectedMsfSessionId }
        val target = session?.target ?: "target"
        val output = when (cmd.lowercase()) {
            "help" -> listOf("Commands: whoami, id, sysinfo, uname -a, ifconfig, ps, pwd, hashdump, clear")
            "whoami" -> listOf("root")
            "id" -> listOf("uid=0(root) gid=0(root) groups=0(root)")
            "pwd" -> listOf("/var/www/html")
            "uname -a" -> listOf("Linux $target 6.1.0-18-arm64 #1 SMP PREEMPT aarch64 GNU/Linux")
            "sysinfo" -> listOf("Computer: $target", "OS: Linux 6.1 LTS (aarch64)", "Meterpreter/Shell: session #${session?.id ?: 1}")
            "ifconfig", "ip a" -> listOf("eth0: inet $target netmask 255.255.255.0")
            "ps" -> listOf("PID  CMD", "1    /sbin/init", "412  /usr/sbin/sshd", "890  /usr/sbin/apache2")
            "hashdump" -> listOf("root:\$6\$salt\$redacted:19400:0:99999:7:::", "admin:\$6\$salt\$redacted:19400:0:99999:7:::")
            "clear" -> {
                _uiState.update { it.copy(shellLines = emptyList()) }
                return
            }
            else -> listOf("sh: executed '$cmd' on $target (exit 0)")
        }
        _uiState.update {
            it.copy(shellLines = it.shellLines + listOf("$target# $cmd") + output)
        }
        addLog(LogLevel.INFO, "MSF Shell", "Session #${session?.id ?: 1}: $cmd")
    }

    fun inspectTls(host: String, port: Int) {
        if (_uiState.value.isInspectingTls) return
        _uiState.update { it.copy(isInspectingTls = true) }
        addLog(LogLevel.INFO, "TLS Audit", "Connecting SSLSocket to $host:$port...")

        viewModelScope.launch {
            val report = NetworkDiagnostics.inspectTlsCertificate(host, port)
            _uiState.update { it.copy(isInspectingTls = false, tlsReport = report) }
            if (report.error == null) {
                addLog(LogLevel.SUCCESS, "TLS Audit", "Verified ${report.host}:${report.port} (${report.protocol}, ${report.cipherSuite})")
            } else {
                addLog(LogLevel.WARN, "TLS Audit", "TLS check failed for ${report.host}: ${report.error}")
            }
        }
    }

    fun auditHttpHeaders(urlOrDomain: String) {
        if (_uiState.value.isAuditingHttp) return
        _uiState.update { it.copy(isAuditingHttp = true) }
        addLog(LogLevel.INFO, "HTTP Audit", "Resolving DNS & auditing security headers for $urlOrDomain...")

        viewModelScope.launch {
            val report = NetworkDiagnostics.auditHttpAndDns(urlOrDomain)
            _uiState.update { it.copy(isAuditingHttp = false, httpReport = report) }
            if (report.error == null) {
                addLog(LogLevel.SUCCESS, "HTTP Audit", "${report.url} -> HTTP ${report.statusCode} (Security Header Score: ${report.score}%)")
            } else {
                addLog(LogLevel.WARN, "HTTP Audit", "Audit error for ${report.url}: ${report.error}")
            }
        }
    }

    fun startTcpPing(host: String, port: Int) {
        pingJob?.cancel()
        _uiState.update { it.copy(isPinging = true, pingSamples = emptyList()) }
        addLog(LogLevel.INFO, "Ping", "Starting TCP RTT monitor to $host:$port...")

        pingJob = viewModelScope.launch {
            for (seq in 1..6) {
                val sample = NetworkDiagnostics.measureTcpPing(host, port, seq)
                _uiState.update { it.copy(pingSamples = it.pingSamples + sample) }
                delay(700)
            }
            _uiState.update { it.copy(isPinging = false) }
            addLog(LogLevel.SUCCESS, "Ping", "Completed 6 latency probes to $host:$port.")
        }
    }

    fun stopTcpPing() {
        pingJob?.cancel()
        _uiState.update { it.copy(isPinging = false) }
    }

    fun buildMarkdownReport(): String {
        val state = _uiState.value
        val sb = StringBuilder()
        sb.appendLine("# cSploit Security Audit Report")
        sb.appendLine("- Interface: ${state.localInterface.interfaceName} (${state.localInterface.ipAddress})")
        sb.appendLine("- Gateway: ${state.localInterface.gatewayIp} | Subnet: ${state.localInterface.subnetCidr}")
        sb.appendLine("- Hosts Discovered: ${state.hosts.size}")
        sb.appendLine()
        state.hosts.forEach { host ->
            sb.appendLine("## ${host.hostname} (${host.ip})")
            sb.appendLine("- MAC: ${host.mac} | Vendor: ${host.vendor} | OS: ${host.os}")
            sb.appendLine("- Open Ports: ${host.ports.joinToString(", ") { "${it.port}/${it.service}" }.ifBlank { "None" }}")
            if (host.vulnerabilities.isNotEmpty()) {
                sb.appendLine("- CVEs:")
                host.vulnerabilities.forEach { v ->
                    sb.appendLine("  - ${v.cve} (${v.severity}, CVSS ${v.score}): ${v.title}")
                }
            }
            sb.appendLine()
        }
        state.tlsReport?.takeIf { it.error == null }?.let { tls ->
            sb.appendLine("## TLS Inspection: ${tls.host}:${tls.port}")
            sb.appendLine("- Protocol: ${tls.protocol} | Cipher: ${tls.cipherSuite}")
            sb.appendLine("- SHA-256: ${tls.sha256Fingerprint}")
        }
        return sb.toString()
    }

    fun clearLogs() {
        _uiState.update { it.copy(logs = emptyList()) }
    }

    fun addLog(level: LogLevel, source: String, message: String) {
        val entry = ConsoleLogEntry(
            id = "log_${System.currentTimeMillis()}_${(100..999).random()}",
            timestamp = nowTime(),
            level = level,
            source = source,
            message = message
        )
        _uiState.update { it.copy(logs = listOf(entry) + it.logs.take(199)) }
    }

    private fun nowTime(): String = timeFmt.format(Date())
}
