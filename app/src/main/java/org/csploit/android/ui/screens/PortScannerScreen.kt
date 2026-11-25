package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.model.HostItem
import org.csploit.android.model.PortState
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun PortScannerScreen(
    state: CSploitUiState,
    onSelectHost: (HostItem) -> Unit,
    onRunScan: (String, String, Boolean) -> Unit
) {
    val selectedHost = state.selectedHost
    var targetIp by remember(selectedHost?.id) { mutableStateOf(selectedHost?.ip ?: "192.168.1.1") }
    var selectedProfile by remember { mutableStateOf("Quick Scan (Top Services)") }
    var liveSocketProbe by remember { mutableStateOf(false) }

    val profiles = listOf(
        "Quick Scan (Top Services)",
        "Full Common (18 Ports)",
        "Service Banner Fingerprint"
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Port Scanning & Fingerprinting",
                title = "TCP/UDP Port Scanner",
                subtitle = "Probe listening services, grab live socket banners, and inspect open entry vectors.",
                icon = Icons.Default.Search
            )
        }

        item {
            DarkCard {
                Text("Select Discovered Host", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    state.hosts.take(3).forEach { host ->
                        FilterChip(
                            selected = targetIp == host.ip,
                            onClick = {
                                targetIp = host.ip
                                onSelectHost(host)
                            },
                            label = { Text(host.ip, fontFamily = FontFamily.Monospace, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = CrimsonPrimary.copy(alpha = 0.25f),
                                selectedLabelColor = CrimsonLight
                            )
                        )
                    }
                }

                OutlinedTextField(
                    value = targetIp,
                    onValueChange = { targetIp = it },
                    label = { Text("Target Host / IP") },
                    singleLine = true,
                    colors = darkFieldColors(),
                    modifier = Modifier.fillMaxWidth()
                )

                Text("Scan Profile", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    profiles.forEach { profile ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            RadioButton(
                                selected = selectedProfile == profile,
                                onClick = { selectedProfile = profile },
                                colors = RadioButtonDefaults.colors(selectedColor = CrimsonPrimary)
                            )
                            Text(profile, color = TextPrimary, fontSize = 13.sp)
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Live Android TCP Socket Probe", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                        Text("Attempts real TCP connect + banner read on reachable targets", color = TextMuted, fontSize = 11.sp)
                    }
                    Switch(
                        checked = liveSocketProbe,
                        onCheckedChange = { liveSocketProbe = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = ColorWhite, checkedTrackColor = CrimsonPrimary)
                    )
                }

                Button(
                    onClick = { onRunScan(targetIp, selectedProfile, liveSocketProbe) },
                    enabled = !state.isScanningPorts,
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null)
                    Spacer(Modifier.width(6.dp))
                    Text(if (state.isScanningPorts) "Scanning Ports..." else "Start Port Scan")
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "Results for $targetIp",
                    color = TextPrimary,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
                StatusBadge(
                    "${state.portScanResults.count { it.state == PortState.OPEN }} Open",
                    EmeraldOnline,
                    EmeraldOnline.copy(alpha = 0.14f)
                )
            }
        }

        if (state.portScanResults.isEmpty()) {
            item {
                DarkCard {
                    Text(
                        "No open ports detected in this profile. Try disabling Live Probe for simulated LAN hosts or probe a reachable IP.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                }
            }
        } else {
            items(state.portScanResults) { port ->
                Surface(
                    color = SlateSurface,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, SlateBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    "${port.port}/${port.protocol}",
                                    color = CrimsonLight,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                                Text(port.service, color = TextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            }
                            if (port.version.isNotBlank()) {
                                Text(port.version, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                            }
                        }
                        val stateColor = when (port.state) {
                            PortState.OPEN -> EmeraldOnline
                            PortState.FILTERED -> AmberWarn
                            PortState.CLOSED -> TextMuted
                        }
                        StatusBadge(port.state.name, stateColor, stateColor.copy(alpha = 0.14f))
                    }
                }
            }
        }
    }
}

private val ColorWhite = androidx.compose.ui.graphics.Color.White
