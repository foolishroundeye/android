package org.csploit.android.model

enum class ToolTab(val label: String) {
    RADAR("Radar"),
    PORTS("Ports"),
    VULNS("CVEs"),
    MITM("MITM"),
    NET_TOOLS("NetTools"),
    CRACKER("Cracker"),
    WIFI("WiFi Key"),
    FORGER("Forger"),
    METASPLOIT("MSF RPC"),
    CONSOLE("Console")
}

enum class PortState {
    OPEN, CLOSED, FILTERED
}

enum class VulnSeverity {
    CRITICAL, HIGH, MEDIUM, LOW
}

enum class LogLevel {
    INFO, SUCCESS, WARN, ERROR, EXPLOIT
}

data class PortEntry(
    val port: Int,
    val protocol: String = "tcp",
    val service: String,
    val state: PortState = PortState.OPEN,
    val version: String = ""
)

data class VulnerabilityEntry(
    val id: String,
    val cve: String,
    val title: String,
    val severity: VulnSeverity,
    val score: Double,
    val description: String,
    val exploitAvailable: Boolean,
    val moduleName: String? = null
)

data class HostItem(
    val id: String,
    val ip: String,
    val mac: String,
    val hostname: String,
    val vendor: String,
    val os: String,
    val online: Boolean = true,
    val isRouter: Boolean = false,
    val isSelf: Boolean = false,
    val ports: List<PortEntry> = emptyList(),
    val vulnerabilities: List<VulnerabilityEntry> = emptyList()
)

data class SniffedCredential(
    val id: String,
    val timestamp: String,
    val protocol: String,
    val targetIp: String,
    val username: String,
    val password: String,
    val details: String
)

data class DnsSpoofRule(
    val id: String,
    val domain: String,
    val redirectIp: String,
    val enabled: Boolean = true
)

data class HijackedSession(
    val id: String,
    val domain: String,
    val cookieName: String,
    val cookieValue: String,
    val username: String,
    val timestamp: String
)

data class WifiAccessPoint(
    val ssid: String,
    val bssid: String,
    val rssi: Int,
    val channel: Int,
    val encryption: String,
    val vulnerable: Boolean,
    val defaultKeys: List<String> = emptyList(),
    val algorithm: String = "Standard WPA2"
)

data class MsfSessionItem(
    val id: Int,
    val type: String,
    val tunnel: String,
    val viaExploit: String,
    val viaPayload: String,
    val target: String,
    val active: Boolean = true
)

data class ConsoleLogEntry(
    val id: String,
    val timestamp: String,
    val level: LogLevel,
    val source: String,
    val message: String
)

data class LocalInterfaceSummary(
    val interfaceName: String,
    val ipAddress: String,
    val gatewayIp: String,
    val subnetCidr: String,
    val dnsServers: List<String>,
    val isRooted: Boolean
)

data class TlsCertReport(
    val host: String,
    val port: Int,
    val protocol: String,
    val cipherSuite: String,
    val subject: String,
    val issuer: String,
    val validFrom: String,
    val validUntil: String,
    val sha256Fingerprint: String,
    val error: String? = null
)

data class HttpAuditReport(
    val url: String,
    val statusCode: Int,
    val resolvedIps: List<String>,
    val serverHeader: String,
    val securityHeaders: Map<String, String?>,
    val score: Int,
    val error: String? = null
)

data class PingSample(
    val seq: Int,
    val host: String,
    val port: Int,
    val rttMs: Long,
    val reachable: Boolean
)
