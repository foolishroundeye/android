package org.csploit.android.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.csploit.android.model.WifiAccessPoint
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitUiState

@Composable
fun WifiKeygenScreen(
    state: CSploitUiState,
    onRefreshScan: () -> Unit,
    onComputeKeys: (WifiAccessPoint) -> Unit
) {
    val selectedAp = state.wifiNetworks.firstOrNull { it.bssid == state.selectedWifiBssid }
        ?: state.wifiNetworks.first()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SectionBanner(
                eyebrow = "Wireless Scanner & Keygen",
                title = "Wi-Fi Security Audit",
                subtitle = "Audit nearby access points and compute factory default WPA/WEP keys from router SSID/BSSID algorithms.",
                icon = Icons.Default.Wifi
            ) {
                OutlinedButton(
                    onClick = onRefreshScan,
                    border = BorderStroke(1.dp, SlateBorder),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Rescan Nearby BSSIDs")
                }
            }
        }

        items(state.wifiNetworks, key = { it.bssid }) { ap ->
            val isSelected = ap.bssid == selectedAp.bssid
            DarkCard(
                borderColor = if (isSelected) CrimsonPrimary else SlateBorder,
                modifier = Modifier.clickable { onComputeKeys(ap) }
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(ap.ssid, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("${ap.bssid} • Ch ${ap.channel} • ${ap.rssi} dBm", color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                    }
                    Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        StatusBadge(ap.encryption, CyanInfo, SlateCard)
                        StatusBadge(
                            if (ap.vulnerable) "VULNERABLE" else "SECURE",
                            if (ap.vulnerable) CrimsonLight else EmeraldOnline,
                            if (ap.vulnerable) CrimsonPrimary.copy(alpha = 0.16f) else EmeraldOnline.copy(alpha = 0.14f)
                        )
                    }
                }
                Text(ap.algorithm, color = TextMuted, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
            }
        }

        item {
            DarkCard(borderColor = CrimsonPrimary.copy(alpha = 0.5f)) {
                Text("Keygen Output: ${selectedAp.ssid}", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Button(
                    onClick = { onComputeKeys(selectedAp) },
                    enabled = !state.isCrackingWifi,
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Key, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(if (state.isCrackingWifi) "Computing Candidates..." else "Calculate Default Keys")
                }

                if (state.computedWifiKeys.isNotEmpty()) {
                    Surface(color = ObsidianBg, shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, EmeraldOnline.copy(alpha = 0.4f))) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("Candidate Default Keys:", color = EmeraldOnline, fontFamily = FontFamily.Monospace, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            state.computedWifiKeys.forEach { key ->
                                Text(key, color = AmberWarn, fontFamily = FontFamily.Monospace, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
