package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun LoginCrackerScreen(
    state: CSploitUiState,
    onStart: (String, String, Int, String, String) -> Unit,
    onStop: () -> Unit
) {
    var protocol by remember { mutableStateOf("SSH") }
    var targetIp by remember { mutableStateOf(state.selectedHost?.ip ?: "192.168.1.1") }
    var portText by remember { mutableStateOf("22") }
    var username by remember { mutableStateOf("root") }
    var wordlist by remember { mutableStateOf("rockyou_top100.txt") }

    val protocols = listOf("SSH" to "22", "FTP" to "21", "HTTP" to "80", "TELNET" to "23", "SMB" to "445")
    val wordlists = listOf("rockyou_top100.txt", "router_defaults.txt", "common_creds.txt")

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Hydra Service Login Cracker",
                title = "Credential Audit & Brute-Forcer",
                subtitle = "Test SSH, FTP, HTTP Basic Auth, Telnet, and SMB endpoints against common dictionary wordlists.",
                icon = Icons.Default.Key
            )
        }

        item {
            DarkCard {
                Text("Protocol", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    protocols.forEach { (proto, defaultPort) ->
                        FilterChip(
                            selected = protocol == proto,
                            onClick = {
                                protocol = proto
                                portText = defaultPort
                            },
                            label = { Text(proto, fontFamily = FontFamily.Monospace, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = CrimsonPrimary.copy(alpha = 0.25f),
                                selectedLabelColor = CrimsonLight
                            )
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = targetIp,
                        onValueChange = { targetIp = it },
                        label = { Text("Target IP") },
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
                    value = username,
                    onValueChange = { username = it },
                    label = { Text("Username") },
                    singleLine = true,
                    colors = darkFieldColors(),
                    modifier = Modifier.fillMaxWidth()
                )

                Text("Wordlist", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    wordlists.forEach { wl ->
                        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                            RadioButton(
                                selected = wordlist == wl,
                                onClick = { wordlist = wl },
                                colors = RadioButtonDefaults.colors(selectedColor = CrimsonPrimary)
                            )
                            Text(wl, color = TextPrimary, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                        }
                    }
                }

                Button(
                    onClick = {
                        if (state.isCrackingLogin) onStop()
                        else onStart(protocol, targetIp, portText.toIntOrNull() ?: 22, username, wordlist)
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (state.isCrackingLogin) AmberWarn else CrimsonPrimary
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(if (state.isCrackingLogin) Icons.Default.Stop else Icons.Default.PlayArrow, contentDescription = null)
                    Spacer(Modifier.width(6.dp))
                    Text(if (state.isCrackingLogin) "Abort Brute-Force" else "Start Login Cracker")
                }
            }
        }

        item {
            DarkCard {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Live Attack Telemetry", color = TextPrimary, fontWeight = FontWeight.Bold)
                    StatusBadge(
                        if (state.isCrackingLogin) "RUNNING" else if (state.loginFoundResult != null) "FOUND" else "IDLE",
                        if (state.isCrackingLogin) CrimsonLight else if (state.loginFoundResult != null) EmeraldOnline else TextMuted,
                        SlateCard
                    )
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, SlateBorder), modifier = Modifier.weight(1f)) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Attempts", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                            Text("${state.loginAttempts}", color = TextPrimary, fontFamily = FontFamily.Monospace, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, SlateBorder), modifier = Modifier.weight(1f)) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Service", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                            Text("$protocol:$portText", color = CrimsonLight, fontFamily = FontFamily.Monospace, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                state.loginFoundResult?.let { result ->
                    Surface(
                        color = EmeraldOnline.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, EmeraldOnline.copy(alpha = 0.4f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Credentials Discovered!", color = EmeraldOnline, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(result, color = AmberWarn, fontFamily = FontFamily.Monospace, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
