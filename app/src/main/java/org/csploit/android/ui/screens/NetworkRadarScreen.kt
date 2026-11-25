package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.model.HostItem
import org.csploit.android.model.ToolTab
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun NetworkRadarScreen(
    state: CSploitUiState,
    onScanSubnet: () -> Unit,
    onAddHost: (String, String) -> Unit,
    onInspectHost: (HostItem, ToolTab) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var showAddDialog by remember { mutableStateOf(false) }
    var newIp by remember { mutableStateOf("192.168.1.") }
    var newHostname by remember { mutableStateOf("") }

    val filteredHosts = remember(state.hosts, searchQuery) {
        if (searchQuery.isBlank()) state.hosts
        else state.hosts.filter {
            it.ip.contains(searchQuery, ignoreCase = true) ||
                it.hostname.contains(searchQuery, ignoreCase = true) ||
                it.vendor.contains(searchQuery, ignoreCase = true) ||
                it.os.contains(searchQuery, ignoreCase = true)
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Subnet Radar • ${state.localInterface.subnetCidr}",
                title = "Discovered Network Hosts",
                subtitle = "Local ${state.localInterface.interfaceName}: ${state.localInterface.ipAddress} • GW: ${state.localInterface.gatewayIp} • Mode: ${if (state.localInterface.isRooted) "Rooted" else "Modern Non-Root"}",
                icon = Icons.Default.Wifi
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = { showAddDialog = true },
                        border = BorderStroke(1.dp, SlateBorder),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Add Host")
                    }
                    Button(
                        onClick = onScanSubnet,
                        enabled = !state.isScanningSubnet,
                        colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Radar, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text(if (state.isScanningSubnet) "Scanning..." else "Scan Subnet")
                    }
                }
            }
        }

        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Filter by IP, hostname, vendor, or OS...", fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextMuted) },
                singleLine = true,
                colors = darkFieldColors(),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth()
            )
        }

        items(filteredHosts, key = { it.id }) { host ->
            HostCard(host = host, onInspectHost = onInspectHost)
        }
    }

    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            containerColor = SlateSurface,
            titleContentColor = TextPrimary,
            textContentColor = TextMuted,
            title = { Text("Add Custom Target Host", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Add a LAN or remote IPv4/domain target for port & CVE inspection.", fontSize = 13.sp)
                    OutlinedTextField(
                        value = newIp,
                        onValueChange = { newIp = it },
                        label = { Text("IP Address or Domain") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = newHostname,
                        onValueChange = { newHostname = it },
                        label = { Text("Hostname (Optional)") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        onAddHost(newIp, newHostname)
                        showAddDialog = false
                        newIp = "192.168.1."
                        newHostname = ""
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary)
                ) { Text("Add Host") }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("Cancel", color = TextMuted)
                }
            }
        )
    }
}

@Composable
private fun HostCard(
    host: HostItem,
    onInspectHost: (HostItem, ToolTab) -> Unit
) {
    val border = when {
        host.isRouter -> CrimsonPrimary.copy(alpha = 0.55f)
        host.isSelf -> CyanInfo.copy(alpha = 0.55f)
        else -> SlateBorder
    }
    val icon = when {
        host.isRouter -> Icons.Default.Router
        host.os.contains("Android", ignoreCase = true) -> Icons.Default.Smartphone
        host.os.contains("Linux", ignoreCase = true) || host.os.contains("Debian", ignoreCase = true) -> Icons.Default.Dns
        else -> Icons.Default.Devices
    }

    DarkCard(borderColor = border) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.weight(1f)) {
                Surface(
                    color = if (host.isRouter) CrimsonPrimary.copy(alpha = 0.14f) else SlateCard,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, SlateBorder),
                    modifier = Modifier.size(42.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            icon,
                            contentDescription = null,
                            tint = if (host.isRouter) CrimsonLight else if (host.isSelf) CyanInfo else TextPrimary
                        )
                    }
                }
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = host.hostname,
                            color = TextPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        if (host.isRouter) StatusBadge("GW", CrimsonLight, CrimsonPrimary.copy(alpha = 0.16f))
                        if (host.isSelf) StatusBadge("YOU", CyanInfo, CyanInfo.copy(alpha = 0.16f))
                    }
                    Text(
                        text = host.ip,
                        color = CrimsonLight,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp
                    )
                }
            }
            StatusBadge("ONLINE", EmeraldOnline, EmeraldOnline.copy(alpha = 0.12f))
        }

        Surface(
            color = ObsidianBg,
            shape = RoundedCornerShape(8.dp),
            border = BorderStroke(1.dp, SlateBorder.copy(alpha = 0.6f))
        ) {
            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                InfoRow("MAC", host.mac)
                InfoRow("Vendor", host.vendor)
                InfoRow("OS", host.os)
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            StatusBadge("${host.ports.size} Port(s)", TextPrimary, SlateCard, SlateBorder)
            if (host.vulnerabilities.isNotEmpty()) {
                StatusBadge(
                    "${host.vulnerabilities.size} CVE(s)",
                    CrimsonLight,
                    CrimsonPrimary.copy(alpha = 0.16f)
                )
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
            OutlinedButton(
                onClick = { onInspectHost(host, ToolTab.PORTS) },
                border = BorderStroke(1.dp, SlateBorder),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                modifier = Modifier.weight(1f)
            ) {
                Icon(Icons.Default.Search, contentDescription = null, tint = CrimsonLight, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(6.dp))
                Text("Port Scan", fontSize = 12.sp)
            }
            Button(
                onClick = { onInspectHost(host, ToolTab.VULNS) },
                colors = ButtonDefaults.buttonColors(
                    containerColor = CrimsonPrimary.copy(alpha = 0.22f),
                    contentColor = CrimsonLight
                ),
                border = BorderStroke(1.dp, CrimsonPrimary.copy(alpha = 0.45f)),
                modifier = Modifier.weight(1f)
            ) {
                Icon(Icons.Default.Security, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(6.dp))
                Text("Inspect CVEs", fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
        Text(
            value,
            color = TextPrimary,
            fontFamily = FontFamily.Monospace,
            fontSize = 11.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
