package org.csploit.android.ui.screens

import android.content.Intent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun NetToolsScreen(
    state: CSploitUiState,
    onInspectTls: (String, Int) -> Unit,
    onAuditHttp: (String) -> Unit,
    onStartPing: (String, Int) -> Unit,
    onStopPing: () -> Unit,
    onBuildReport: () -> String
) {
    val context = LocalContext.current
    val clipboard = LocalClipboardManager.current

    var tlsHost by remember { mutableStateOf("google.com") }
    var tlsPort by remember { mutableStateOf("443") }
    var httpTarget by remember { mutableStateOf("https://example.com") }
    var pingHost by remember { mutableStateOf(state.localInterface.gatewayIp) }
    var pingPort by remember { mutableStateOf("80") }
    var copiedNotice by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Modern Non-Root Network Suite",
                title = "TLS, HTTP Headers, Ping & Reports",
                subtitle = "Live Android diagnostics using standard sockets, SSLSocketFactory X.509 inspection, DNS lookup, and exportable Markdown reports.",
                icon = Icons.Default.VerifiedUser
            )
        }

        // TLS / SSL Certificate Inspector
        item {
            DarkCard {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Https, contentDescription = null, tint = EmeraldOnline, modifier = Modifier.size(18.dp))
                    Text("TLS / SSL Certificate Inspector", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = tlsHost,
                        onValueChange = { tlsHost = it },
                        label = { Text("Host") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.weight(2f)
                    )
                    OutlinedTextField(
                        value = tlsPort,
                        onValueChange = { tlsPort = it.filter { ch -> ch.isDigit() } },
                        label = { Text("Port") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.weight(1f)
                    )
                }
                Button(
                    onClick = { onInspectTls(tlsHost, tlsPort.toIntOrNull() ?: 443) },
                    enabled = !state.isInspectingTls,
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (state.isInspectingTls) "Inspecting Handshake..." else "Inspect TLS Certificate")
                }

                state.tlsReport?.let { rep ->
                    Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, SlateBorder)) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            if (rep.error != null) {
                                Text("Error: ${rep.error}", color = AmberWarn, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                            } else {
                                Text("${rep.protocol} • ${rep.cipherSuite}", color = EmeraldOnline, fontFamily = FontFamily.Monospace, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Text("Subject: ${rep.subject}", color = TextPrimary, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                                Text("Issuer: ${rep.issuer}", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                                Text("Valid Until: ${rep.validUntil}", color = CyanInfo, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                                Text("SHA-256: ${rep.sha256Fingerprint}", color = AmberWarn, fontFamily = FontFamily.Monospace, fontSize = 10.sp)
                            }
                        }
                    }
                }
            }
        }

        // DNS & HTTP Security Headers Auditor
        item {
            DarkCard {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Http, contentDescription = null, tint = CyanInfo, modifier = Modifier.size(18.dp))
                    Text("DNS & HTTP Security Header Audit", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                OutlinedTextField(
                    value = httpTarget,
                    onValueChange = { httpTarget = it },
                    label = { Text("URL or Domain") },
                    singleLine = true,
                    colors = darkFieldColors(),
                    modifier = Modifier.fillMaxWidth()
                )
                Button(
                    onClick = { onAuditHttp(httpTarget) },
                    enabled = !state.isAuditingHttp,
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (state.isAuditingHttp) "Auditing Headers..." else "Run DNS & Header Audit")
                }

                state.httpReport?.let { rep ->
                    Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, SlateBorder)) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (rep.error != null) {
                                Text("Error: ${rep.error}", color = AmberWarn, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                            } else {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("HTTP ${rep.statusCode} • Server: ${rep.serverHeader}", color = TextPrimary, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                                    StatusBadge("Score ${rep.score}%", if (rep.score >= 50) EmeraldOnline else AmberWarn, SlateCard)
                                }
                                if (rep.resolvedIps.isNotEmpty()) {
                                    Text("DNS A/AAAA: ${rep.resolvedIps.joinToString(", ")}", color = CyanInfo, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                                }
                                rep.securityHeaders.forEach { (header, value) ->
                                    val present = !value.isNullOrBlank()
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        Text(header, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp, modifier = Modifier.weight(1f))
                                        Text(
                                            if (present) "PRESENT" else "MISSING",
                                            color = if (present) EmeraldOnline else CrimsonLight,
                                            fontFamily = FontFamily.Monospace,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // TCP Latency Ping Monitor
        item {
            DarkCard {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Speed, contentDescription = null, tint = AmberWarn, modifier = Modifier.size(18.dp))
                    Text("TCP Latency & Reachability Monitor", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = pingHost,
                        onValueChange = { pingHost = it },
                        label = { Text("Target IP / Host") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.weight(2f)
                    )
                    OutlinedTextField(
                        value = pingPort,
                        onValueChange = { pingPort = it.filter { ch -> ch.isDigit() } },
                        label = { Text("Port") },
                        singleLine = true,
                        colors = darkFieldColors(),
                        modifier = Modifier.weight(1f)
                    )
                }
                Button(
                    onClick = {
                        if (state.isPinging) onStopPing() else onStartPing(pingHost, pingPort.toIntOrNull() ?: 80)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = if (state.isPinging) AmberWarn else CrimsonPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (state.isPinging) "Stop Ping Monitor" else "Start 6x TCP Latency Probe")
                }

                if (state.pingSamples.isNotEmpty()) {
                    Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, SlateBorder)) {
                        Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            state.pingSamples.forEach { sample ->
                                Text(
                                    "seq=${sample.seq} ${sample.host}:${sample.port} rtt=${sample.rttMs}ms (${if (sample.reachable) "OPEN" else "UNREACHABLE/CLOSED"})",
                                    color = if (sample.reachable) EmeraldOnline else TextMuted,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        // Security Audit Report Export
        item {
            DarkCard {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Description, contentDescription = null, tint = CrimsonLight, modifier = Modifier.size(18.dp))
                    Text("Export Security Audit Report", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Text("Generate a full Markdown summary of discovered hosts, open ports, CVEs, and TLS findings.", color = TextMuted, fontSize = 12.sp)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = {
                            clipboard.setText(AnnotatedString(onBuildReport()))
                            copiedNotice = true
                        },
                        border = BorderStroke(1.dp, SlateBorder),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text(if (copiedNotice) "Copied!" else "Copy Report")
                    }
                    Button(
                        onClick = {
                            val report = onBuildReport()
                            val sendIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_SUBJECT, "cSploit Security Audit Report")
                                putExtra(Intent.EXTRA_TEXT, report)
                            }
                            context.startActivity(Intent.createChooser(sendIntent, "Share Audit Report"))
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Share")
                    }
                }
            }
        }
    }
}
