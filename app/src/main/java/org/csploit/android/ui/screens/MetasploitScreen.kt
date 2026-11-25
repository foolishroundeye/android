package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun MetasploitScreen(
    state: CSploitUiState,
    onSelectSession: (Int) -> Unit,
    onKillSession: (Int) -> Unit,
    onRunShellCommand: (String) -> Unit
) {
    var shellInput by remember { mutableStateOf("") }
    val activeSession = state.msfSessions.firstOrNull { it.id == state.selectedMsfSessionId }
        ?: state.msfSessions.firstOrNull()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Metasploit Framework RPC Daemon",
                title = "MSF Sessions & Shell",
                subtitle = "Manage active exploit sessions, inspect tunnels, and interact with remote shells.",
                icon = Icons.Default.Memory
            ) {
                StatusBadge("RPCd Connected (127.0.0.1:55553)", EmeraldOnline, EmeraldOnline.copy(alpha = 0.14f))
            }
        }

        if (state.msfSessions.isEmpty()) {
            item {
                DarkCard {
                    Text(
                        "No active Metasploit sessions. Launch an exploit from the CVEs tab to open a shell session.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                }
            }
        } else {
            items(state.msfSessions, key = { it.id }) { session ->
                val isSelected = activeSession?.id == session.id
                DarkCard(
                    borderColor = if (isSelected) CrimsonPrimary else SlateBorder,
                    modifier = Modifier.clickable { onSelectSession(session.id) }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                Text("Session #${session.id}", color = CrimsonLight, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                StatusBadge(session.type.uppercase(), EmeraldOnline, EmeraldOnline.copy(alpha = 0.12f))
                            }
                            Text(session.target, color = TextPrimary, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text(session.tunnel, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                            Text(session.viaExploit, color = CyanInfo, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                        }
                        IconButton(onClick = { onKillSession(session.id) }) {
                            Icon(Icons.Default.Delete, contentDescription = "Kill session", tint = CrimsonLight)
                        }
                    }
                }
            }
        }

        if (activeSession != null) {
            item {
                DarkCard(borderColor = CrimsonPrimary.copy(alpha = 0.45f)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Terminal, contentDescription = null, tint = CrimsonLight, modifier = Modifier.size(18.dp))
                        Text(
                            "Interactive Shell • #${activeSession.id} (${activeSession.target})",
                            color = TextPrimary,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }

                    Surface(
                        color = ObsidianBg,
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, SlateBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            state.shellLines.takeLast(18).forEach { line ->
                                Text(
                                    text = line,
                                    color = if (line.contains("# ")) AmberWarn else EmeraldOnline,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                        OutlinedTextField(
                            value = shellInput,
                            onValueChange = { shellInput = it },
                            placeholder = { Text("whoami, sysinfo, ps, help...", fontFamily = FontFamily.Monospace, fontSize = 12.sp) },
                            singleLine = true,
                            colors = darkFieldColors(),
                            modifier = Modifier.weight(1f)
                        )
                        Button(
                            onClick = {
                                onRunShellCommand(shellInput)
                                shellInput = ""
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary)
                        ) {
                            Icon(Icons.Default.Send, contentDescription = "Run", modifier = Modifier.size(16.dp))
                        }
                    }
                }
            }
        }
    }
}
