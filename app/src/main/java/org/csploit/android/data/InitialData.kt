package org.csploit.android.data

import org.csploit.android.model.*

object InitialData {
    val hosts = listOf(
        HostItem(
            id = "h1",
            ip = "192.168.1.1",
            mac = "00:11:22:33:44:55",
            hostname = "router.home",
            vendor = "TP-Link Technologies",
            os = "Linux 5.x / OpenWrt",
            online = true,
            isRouter = true,
            ports = listOf(
                PortEntry(22, "tcp", "ssh", PortState.OPEN, "Dropbear sshd 2022.83"),
                PortEntry(53, "tcp", "domain", PortState.OPEN, "dnsmasq 2.89"),
                PortEntry(80, "tcp", "http", PortState.OPEN, "uhttpd 1.0.0"),
                PortEntry(443, "tcp", "https", PortState.OPEN, "OpenSSL 3.0")
            ),
            vulnerabilities = listOf(
                VulnerabilityEntry(
                    id = "v1",
                    cve = "CVE-2021-31805",
                    title = "RouterOS / OpenWrt Remote Code Execution",
                    severity = VulnSeverity.CRITICAL,
                    score = 9.8,
                    description = "Unauthenticated RCE vulnerability in web management interface.",
                    exploitAvailable = true,
                    moduleName = "exploit/linux/http/router_rce"
                ),
                VulnerabilityEntry(
                    id = "v2",
                    cve = "CVE-2019-15107",
                    title = "Webmin <= 1.920 Unauthenticated RCE",
                    severity = VulnSeverity.HIGH,
                    score = 8.8,
                    description = "Password reset password_change.cgi command injection backdoor.",
                    exploitAvailable = true,
                    moduleName = "exploit/unix/webapp/webmin_backdoor"
                )
            )
        ),
        HostItem(
            id = "h2",
            ip = "192.168.1.105",
            mac = "74:DA:38:12:9A:BC",
            hostname = "android-device.local",
            vendor = "Google LLC",
            os = "Android 15 (API 35/36)",
            online = true,
            isSelf = true,
            ports = listOf(
                PortEntry(5555, "tcp", "adb", PortState.OPEN, "Android Debug Bridge (Wireless)")
            ),
            vulnerabilities = emptyList()
        ),
        HostItem(
            id = "h3",
            ip = "192.168.1.112",
            mac = "B8:27:EB:4F:1A:88",
            hostname = "raspberrypi.home",
            vendor = "Raspberry Pi Foundation",
            os = "Debian GNU/Linux 12 (Bookworm)",
            online = true,
            ports = listOf(
                PortEntry(22, "tcp", "ssh", PortState.OPEN, "OpenSSH 9.2p1 Debian"),
                PortEntry(80, "tcp", "http", PortState.OPEN, "Apache/2.4.57"),
                PortEntry(445, "tcp", "microsoft-ds", PortState.OPEN, "Samba smbd 4.17")
            ),
            vulnerabilities = listOf(
                VulnerabilityEntry(
                    id = "v3",
                    cve = "CVE-2021-41773",
                    title = "Apache 2.4.49 / 2.4.50 Path Traversal & RCE",
                    severity = VulnSeverity.CRITICAL,
                    score = 9.8,
                    description = "Path normalization flaw allowing unauthenticated remote code execution.",
                    exploitAvailable = true,
                    moduleName = "exploit/multi/http/apache_normalize_path_rce"
                )
            )
        ),
        HostItem(
            id = "h4",
            ip = "192.168.1.140",
            mac = "AC:DE:48:78:90:12",
            hostname = "smart-tv.home",
            vendor = "LG Electronics",
            os = "webOS 23",
            online = true,
            ports = listOf(
                PortEntry(3000, "tcp", "hbbtv", PortState.OPEN, "webOS WebSocket RPC"),
                PortEntry(9999, "tcp", "tv-control", PortState.OPEN, "UPnP MediaRenderer")
            ),
            vulnerabilities = listOf(
                VulnerabilityEntry(
                    id = "v4",
                    cve = "CVE-2023-27136",
                    title = "LG webOS PIN Bypass & Command Execution",
                    severity = VulnSeverity.HIGH,
                    score = 8.5,
                    description = "Insecure PIN validation allows LAN attackers to gain root shell.",
                    exploitAvailable = false
                )
            )
        )
    )

    val credentials = listOf(
        SniffedCredential(
            id = "c1",
            timestamp = "14:22:05",
            protocol = "HTTP",
            targetIp = "192.168.1.112",
            username = "admin",
            password = "SuperSecretPassword123",
            details = "POST /login.php HTTP/1.1 (Form Auth)"
        ),
        SniffedCredential(
            id = "c2",
            timestamp = "14:25:10",
            protocol = "FTP",
            targetIp = "192.168.1.1",
            username = "root",
            password = "root",
            details = "USER root / PASS root (Cleartext FTP)"
        )
    )

    val dnsRules = listOf(
        DnsSpoofRule("d1", "update.antivirus.local", "192.168.1.105", true),
        DnsSpoofRule("d2", "login.corpnet.internal", "192.168.1.105", false)
    )

    val hijackedSessions = listOf(
        HijackedSession(
            id = "s1",
            domain = "admin.router.home",
            cookieName = "session_id",
            cookieValue = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.secure99",
            username = "admin",
            timestamp = "14:20:12"
        )
    )

    val wifiNetworks = listOf(
        WifiAccessPoint(
            ssid = "TP-Link_Guest_99",
            bssid = "C0:25:E9:12:34:56",
            rssi = -54,
            channel = 6,
            encryption = "WPA2-PSK",
            vulnerable = true,
            defaultKeys = listOf("99123456", "TPLINK98765", "admin2024"),
            algorithm = "TP-Link WPS PIN / Default Keygen"
        ),
        WifiAccessPoint(
            ssid = "Thomson_F48A21",
            bssid = "00:19:3E:F4:8A:21",
            rssi = -68,
            channel = 1,
            encryption = "WEP",
            vulnerable = true,
            defaultKeys = listOf("4A21F48A21", "00193EF48A", "9876543210"),
            algorithm = "Thomson SHA-1 SpeedTouch Keygen"
        ),
        WifiAccessPoint(
            ssid = "Alice-84910244",
            bssid = "00:25:53:4F:11:A0",
            rssi = -61,
            channel = 11,
            encryption = "WPA/TKIP",
            vulnerable = true,
            defaultKeys = listOf("a8f91c22d4e10b73", "alice_84910244"),
            algorithm = "Alice Pirelli AGPF Keygen"
        ),
        WifiAccessPoint(
            ssid = "SecureHome_5G_WiFi6",
            bssid = "98:DE:D0:11:22:33",
            rssi = -42,
            channel = 36,
            encryption = "WPA3-SAE",
            vulnerable = false,
            algorithm = "Protected (WPA3-SAE)"
        )
    )

    val msfSessions = listOf(
        MsfSessionItem(
            id = 1,
            type = "shell",
            tunnel = "192.168.1.105:4444 -> 192.168.1.112:38421",
            viaExploit = "exploit/multi/http/apache_normalize_path_rce",
            viaPayload = "payload/cmd/unix/reverse_bash",
            target = "192.168.1.112",
            active = true
        )
    )

    val logs = listOf(
        ConsoleLogEntry("l1", "14:00:01", LogLevel.INFO, "Core", "cSploit v2.0 Modernized (API 36) initialized in non-root compatible mode."),
        ConsoleLogEntry("l2", "14:00:02", LogLevel.SUCCESS, "Radar", "Active subnet mapped: 4 hosts online."),
        ConsoleLogEntry("l3", "14:00:15", LogLevel.WARN, "MITM", "Packet & ARP inspection engine standing by."),
        ConsoleLogEntry("l4", "14:05:30", LogLevel.EXPLOIT, "Metasploit", "MSF RPC bridge connected (127.0.0.1:55553).")
    )
}
