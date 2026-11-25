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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun MitmFrameworkScreen(
    state: CSploitUiState,
    onToggleMitm: () -> Unit,
    onAddDnsRule: (String, String) -> Unit,
    onToggleDnsRule: (String) -> Unit,
    onDeleteDnsRule: (String) -> Unit,
    onApplyInjection: (String) -> Unit
) {
    var subTab by remember { mutableIntStateOf(0) }
    var newDomain by remember { mutableStateOf("") }
    var newRedirectIp by remember { mutableStateOf(state.localInterface.ipAddress) }
    var targetImgRegex by remember { mutableStateOf("http://example.com/logo.png") }
    var replaceImgUrl by remember { mutableStateOf("https://csploit.org/logo.png") }
    var jsPayload by remember { mutableStateOf("<script>console.log('cSploit MITM Active');</script>") }

    val subTabs = listOf(
        "Sniffer (${state.credentials.size})",
        "DNS (${state.dnsRules.size})",
        "Hijack (${state.hijackedSessions.size})",
        "Inject"
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Man-in-the-Middle Attack Suite",
                title = "MITM Framework & Sniffer",
                subtitle = "ARP spoofing engine, plaintext credential sniffer, DNS spoof rules, cookie hijacker, and HTTP stream injection.",
                icon = Icons.Default.Visibility
            ) {
                Button(
                    onClick = onToggleMitm,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (state.mitmActive) CrimsonPrimary else SlateCard
                    ),
                    border = BorderStroke(1.dp, if (state.mitmActive) CrimsonLight else SlateBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        if (state.mitmActive) Icons.Default.Stop else Icons.Default.PlayArrow,
                        contentDescription = null
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(if (state.mitmActive) "Stop MITM Engine (ARMED)" else "Arm MITM ARP Spoof")
                }
            }
        }

        item {
            ScrollableTabRow(
                selectedTabIndex = subTab,
                containerColor = SlateSurface,
                contentColor = CrimsonLight,
                edgePadding = 4.dp
            ) {
                subTabs.forEachIndexed { index, label ->
                    Tab(
                        selected = subTab == index,
                        onClick = { subTab = index },
                        text = { Text(label, fontSize = 12.sp, fontFamily = FontFamily.Monospace) }
                    )
                }
            }
        }

        when (subTab) {
            0 -> {
                items(state.credentials, key = { it.id }) { cred ->
                    DarkCard {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                StatusBadge(cred.protocol, CrimsonLight, CrimsonPrimary.copy(alpha = 0.16f))
                                Text(cred.targetIp, color = TextPrimary, fontFamily = FontFamily.Monospace, fontSize = 13.sp)
                            }
                            Text(cred.timestamp, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                        }
                        Surface(
                            color = ObsidianBg,
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, SlateBorder)
                        ) {
                            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text("User: ${cred.username}", color = EmeraldOnline, fontFamily = FontFamily.Monospace, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Text("Pass: ${cred.password}", color = AmberWarn, fontFamily = FontFamily.Monospace, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Text(cred.details, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            1 -> {
                item {
                    DarkCard {
                        Text("Add DNS Redirect Rule", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        OutlinedTextField(
                            value = newDomain,
                            onValueChange = { newDomain = it },
                            label = { Text("Target Domain (e.g. login.target.com)") },
                            singleLine = true,
                            colors = darkFieldColors(),
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = newRedirectIp,
                            onValueChange = { newRedirectIp = it },
                            label = { Text("Redirect IPv4") },
                            singleLine = true,
                            colors = darkFieldColors(),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Button(
                            onClick = {
                                onAddDnsRule(newDomain, newRedirectIp)
                                newDomain = ""
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(Modifier.width(6.dp))
                            Text("Add Spoof Rule")
                        }
                    }
                }

                items(state.dnsRules, key = { it.id }) { rule ->
                    DarkCard {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Checkbox(
                                    checked = rule.enabled,
                                    onCheckedChange = { onToggleDnsRule(rule.id) },
                                    colors = CheckboxDefaults.colors(checkedColor = CrimsonPrimary)
                                )
                                Column {
                                    Text(rule.domain, color = TextPrimary, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    Text("-> ${rule.redirectIp}", color = CrimsonLight, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                                }
                            }
                            IconButton(onClick = { onDeleteDnsRule(rule.id) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = TextMuted)
                            }
                        }
                    }
                }
            }

            2 -> {
                items(state.hijackedSessions, key = { it.id }) { session ->
                    DarkCard {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(session.domain, color = TextPrimary, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                            Text(session.timestamp, color = TextMuted, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                        Text("User: ${session.username} • Cookie: ${session.cookieName}", color = EmeraldOnline, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                        Surface(color = ObsidianBg, shape = RoundedCornerShape(8.dp), border = BorderStroke(1.dp, SlateBorder)) {
                            Text(
                                session.cookieValue,
                                color = AmberWarn,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }
                }
            }

            3 -> {
                item {
                    DarkCard {
                        Text("HTTP Image Replacement", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        OutlinedTextField(
                            value = targetImgRegex,
                            onValueChange = { targetImgRegex = it },
                            label = { Text("Target Image URL Pattern") },
                            colors = darkFieldColors(),
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = replaceImgUrl,
                            onValueChange = { replaceImgUrl = it },
                            label = { Text("Replacement Image URL") },
                            colors = darkFieldColors(),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Button(
                            onClick = { onApplyInjection("Image replacement armed: $targetImgRegex -> $replaceImgUrl") },
                            colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                            modifier = Modifier.fillMaxWidth()
                        ) { Text("Apply Image Rule") }
                    }
                }
                item {
                    DarkCard {
                        Text("JavaScript Stream Injection", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        OutlinedTextField(
                            value = jsPayload,
                            onValueChange = { jsPayload = it },
                            label = { Text("JS Payload") },
                            minLines = 3,
                            colors = darkFieldColors(),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Button(
                            onClick = { onApplyInjection("Injected JS payload (${jsPayload.length} bytes) into HTTP streams.") },
                            colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                            modifier = Modifier.fillMaxWidth()
                        ) { Text("Inject JS Payload") }
                    }
                }
            }
        }
    }
}
