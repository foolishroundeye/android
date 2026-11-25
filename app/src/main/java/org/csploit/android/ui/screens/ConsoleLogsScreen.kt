package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.model.LogLevel
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun ConsoleLogsScreen(
    state: CSploitUiState,
    onClearLogs: () -> Unit
) {
    var selectedLevel by remember { mutableStateOf<LogLevel?>(null) }
    val filtered = remember(state.logs, selectedLevel) {
        if (selectedLevel == null) state.logs
        else state.logs.filter { it.level == selectedLevel }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Real-Time Event & Tool Output",
                title = "Terminal Console",
                subtitle = "Monitor scanner discoveries, socket probes, MITM intercepts, and Metasploit events.",
                icon = Icons.Default.Terminal
            ) {
                OutlinedButton(
                    onClick = onClearLogs,
                    border = BorderStroke(1.dp, SlateBorder),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.DeleteSweep, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Clear Console Logs")
                }
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                FilterChip(
                    selected = selectedLevel == null,
                    onClick = { selectedLevel = null },
                    label = { Text("ALL", fontFamily = FontFamily.Monospace, fontSize = 11.sp) }
                )
                listOf(LogLevel.INFO, LogLevel.SUCCESS, LogLevel.WARN, LogLevel.EXPLOIT).forEach { lvl ->
                    FilterChip(
                        selected = selectedLevel == lvl,
                        onClick = { selectedLevel = lvl },
                        label = { Text(lvl.name, fontFamily = FontFamily.Monospace, fontSize = 10.sp) }
                    )
                }
            }
        }

        if (filtered.isEmpty()) {
            item {
                DarkCard {
                    Text("No console logs matching filter.", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 12.sp)
                }
            }
        } else {
            items(filtered, key = { it.id }) { log ->
                val color = when (log.level) {
                    LogLevel.SUCCESS -> EmeraldOnline
                    LogLevel.WARN -> AmberWarn
                    LogLevel.ERROR, LogLevel.EXPLOIT -> CrimsonLight
                    LogLevel.INFO -> TextPrimary
                }
                Surface(
                    color = ObsidianBg,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, SlateBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            StatusBadge(log.source.uppercase(), color, color.copy(alpha = 0.14f))
                            Text(log.timestamp, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 10.sp)
                        }
                        Text(
                            log.message,
                            color = color,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 12.sp,
                            fontWeight = if (log.level == LogLevel.EXPLOIT) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }
        }
    }
}
