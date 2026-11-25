package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun PacketForgerScreen(
    state: CSploitUiState,
    onSendPacket: (String, String, String, Int, String, Boolean) -> Unit
) {
    var protocol by remember { mutableStateOf("TCP") }
    var srcIp by remember { mutableStateOf(state.localInterface.ipAddress) }
    var dstIp by remember { mutableStateOf(state.selectedHost?.ip ?: state.localInterface.gatewayIp) }
    var portText by remember { mutableStateOf("80") }
    var payload by remember { mutableStateOf("GET / HTTP/1.1\r\nHost: target\r\n\r\n") }
    var realUdpSend by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Packet Crafting & Socket Fuzzing",
                title = "Packet Forger",
                subtitle = "Craft custom TCP, UDP, and ICMP packets with arbitrary payloads or send live UDP datagrams from Android.",
                icon = Icons.Default.Bolt
            )
        }

        item {
            DarkCard {
                Text("Protocol", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("TCP", "UDP", "ICMP").forEach { proto ->
                        FilterChip(
                            selected = protocol == proto,
                            onClick = { protocol = proto },
                            label = { Text(proto, fontFamily = FontFamily.Monospace) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = CrimsonPrimary.copy(alpha = 0.25f),
                                selectedLabelColor = CrimsonLight
                            )
                        )
                    }
                }

                OutlinedTextField(
                    value = srcIp,
                    onValueChange = { srcIp = it },
                    label = { Text("Source IP") },
                    singleLine = true,
                    colors = darkFieldColors(),
                    modifier = Modifier.fillMaxWidth()
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = dstIp,
                        onValueChange = { dstIp = it },
                        label = { Text("Destination IP") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.weight(2f)
                    )
                    OutlinedTextField(
                        value = portText,
                        onValueChange = { portText = it.filter { ch -> ch.isDigit() } },
                        label = { Text("Port") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = payload,
                    onValueChange = { payload = it },
                    label = { Text("Payload (ASCII / Hex)") },
                    minLines = 3,
                    colors = darkFieldColors(),
                    modifier = Modifier.fillMaxWidth()
                )

                if (protocol == "UDP") {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Send Real Android DatagramSocket", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                            Text("Transmits actual UDP packet over active network", color = TextMuted, fontSize = 11.sp)
                        }
                        Switch(
                            checked = realUdpSend,
                            onCheckedChange = { realUdpSend = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = CrimsonPrimary)
                        )
                    }
                }

                Button(
                    onClick = { onSendPacket(protocol, srcIp, dstIp, portText.toIntOrNull() ?: 80, payload, realUdpSend) },
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Transmit Forged Packet")
                }
            }
        }

        item {
            DarkCard {
                Text("Transmission Stats", color = TextPrimary, fontWeight = FontWeight.Bold)
                Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, SlateBorder)) {
                    Column(modifier = Modifier.padding(12.dp).fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("Packets Sent: ${state.packetsSentCount}", color = TextPrimary, fontFamily = FontFamily.Monospace, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        if (state.lastPacketStatus.isNotBlank()) {
                            Text(state.lastPacketStatus, color = EmeraldOnline, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}
