package org.csploit.android

import android.Manifest
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch
import org.csploit.android.model.ToolTab
import org.csploit.android.ui.screens.*
import org.csploit.android.ui.theme.*
import org.csploit.android.viewmodel.CSploitViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CSploitTheme {
                CSploitApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CSploitApp(vm: CSploitViewModel = viewModel()) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) {
        vm.refreshLocalInterface()
    }

    LaunchedEffect(Unit) {
        val perms = buildList {
            add(Manifest.permission.ACCESS_FINE_LOCATION)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                add(Manifest.permission.NEARBY_WIFI_DEVICES)
            }
        }.toTypedArray()
        permissionLauncher.launch(perms)
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(
                drawerContainerColor = SlateSurface,
                drawerContentColor = TextPrimary,
                modifier = Modifier.width(280.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Surface(color = CrimsonPrimary, shape = RoundedCornerShape(10.dp), modifier = Modifier.size(38.dp)) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.Shield, contentDescription = null, tint = Color.White)
                            }
                        }
                        Column {
                            Text("cSploit v2.0", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                            Text("Android API 36 Suite", fontFamily = FontFamily.Monospace, fontSize = 11.sp, color = CrimsonLight)
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                    HorizontalDivider(color = SlateBorder)
                }

                ToolTab.entries.forEach { tab ->
                    val badgeText = when (tab) {
                        ToolTab.RADAR -> state.hosts.size.toString()
                        ToolTab.VULNS -> state.hosts.sumOf { it.vulnerabilities.size }.toString()
                        ToolTab.METASPLOIT -> state.msfSessions.size.toString()
                        ToolTab.CONSOLE -> state.logs.size.toString()
                        else -> null
                    }
                    NavigationDrawerItem(
                        label = {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(tab.label, fontWeight = FontWeight.Medium)
                                if (badgeText != null) {
                                    StatusBadge(badgeText, TextPrimary, SlateCard, SlateBorder)
                                }
                            }
                        },
                        icon = { Icon(tabIcon(tab), contentDescription = null) },
                        selected = state.activeTab == tab,
                        onClick = {
                            vm.selectTab(tab)
                            scope.launch { drawerState.close() }
                        },
                        colors = NavigationDrawerItemDefaults.colors(
                            selectedContainerColor = CrimsonPrimary.copy(alpha = 0.2f),
                            selectedIconColor = CrimsonLight,
                            selectedTextColor = CrimsonLight,
                            unselectedIconColor = TextMuted,
                            unselectedTextColor = TextPrimary
                        ),
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 2.dp)
                    )
                }
            }
        }
    ) {
        Scaffold(
            containerColor = ObsidianBg,
            topBar = {
                TopAppBar(
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = SlateSurface,
                        titleContentColor = TextPrimary
                    ),
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Default.Menu, contentDescription = "Open toolbox menu", tint = TextPrimary)
                        }
                    },
                    title = {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text("cSploit", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                                StatusBadge("v2.0", CrimsonLight, CrimsonPrimary.copy(alpha = 0.16f))
                            }
                            Text(
                                "${state.localInterface.interfaceName}: ${state.localInterface.ipAddress}",
                                color = EmeraldOnline,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 11.sp
                            )
                        }
                    },
                    actions = {
                        Surface(
                            color = if (state.mitmActive) CrimsonPrimary.copy(alpha = 0.22f) else SlateCard,
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, if (state.mitmActive) CrimsonLight else SlateBorder),
                            modifier = Modifier
                                .padding(end = 6.dp)
                                .clickable { vm.toggleMitm() }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(5.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(7.dp)
                                        .background(if (state.mitmActive) CrimsonLight else TextMuted, CircleShape)
                                )
                                Text(
                                    if (state.mitmActive) "MITM ON" else "MITM",
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (state.mitmActive) CrimsonLight else TextMuted
                                )
                            }
                        }

                        IconButton(onClick = { vm.selectTab(ToolTab.CONSOLE) }) {
                            Icon(
                                Icons.Default.Terminal,
                                contentDescription = "Console",
                                tint = if (state.activeTab == ToolTab.CONSOLE) CrimsonLight else TextPrimary
                            )
                        }
                    }
                )
            },
            bottomBar = {
                NavigationBar(containerColor = SlateSurface) {
                    val primaryTabs = listOf(
                        ToolTab.RADAR,
                        ToolTab.PORTS,
                        ToolTab.MITM,
                        ToolTab.NET_TOOLS,
                        ToolTab.METASPLOIT
                    )
                    primaryTabs.forEach { tab ->
                        NavigationBarItem(
                            selected = state.activeTab == tab,
                            onClick = { vm.selectTab(tab) },
                            icon = { Icon(tabIcon(tab), contentDescription = tab.label) },
                            label = { Text(tab.label, fontSize = 10.sp, maxLines = 1) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = CrimsonLight,
                                selectedTextColor = CrimsonLight,
                                indicatorColor = CrimsonPrimary.copy(alpha = 0.18f),
                                unselectedIconColor = TextMuted,
                                unselectedTextColor = TextMuted
                            )
                        )
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                when (state.activeTab) {
                    ToolTab.RADAR -> NetworkRadarScreen(
                        state = state,
                        onScanSubnet = vm::scanSubnet,
                        onAddHost = vm::addCustomHost,
                        onInspectHost = vm::selectHost
                    )
                    ToolTab.PORTS -> PortScannerScreen(
                        state = state,
                        onSelectHost = { vm.selectHost(it) },
                        onRunScan = vm::runPortScan
                    )
                    ToolTab.VULNS -> VulnerabilityFinderScreen(
                        state = state,
                        onSelectHost = { vm.selectHost(it) },
                        onLaunchExploit = vm::launchExploit
                    )
                    ToolTab.MITM -> MitmFrameworkScreen(
                        state = state,
                        onToggleMitm = vm::toggleMitm,
                        onAddDnsRule = vm::addDnsRule,
                        onToggleDnsRule = vm::toggleDnsRule,
                        onDeleteDnsRule = vm::deleteDnsRule,
                        onApplyInjection = vm::applyTrafficInjection
                    )
                    ToolTab.NET_TOOLS -> NetToolsScreen(
                        state = state,
                        onInspectTls = vm::inspectTls,
                        onAuditHttp = vm::auditHttpHeaders,
                        onStartPing = vm::startTcpPing,
                        onStopPing = vm::stopTcpPing,
                        onBuildReport = vm::buildMarkdownReport
                    )
                    ToolTab.CRACKER -> LoginCrackerScreen(
                        state = state,
                        onStart = vm::startLoginCracker,
                        onStop = vm::stopLoginCracker
                    )
                    ToolTab.WIFI -> WifiKeygenScreen(
                        state = state,
                        onRefreshScan = vm::refreshWifiScan,
                        onComputeKeys = vm::calculateWifiKeys
                    )
                    ToolTab.FORGER -> PacketForgerScreen(
                        state = state,
                        onSendPacket = vm::sendForgedPacket
                    )
                    ToolTab.METASPLOIT -> MetasploitScreen(
                        state = state,
                        onSelectSession = vm::selectMsfSession,
                        onKillSession = vm::killMsfSession,
                        onRunShellCommand = vm::runShellCommand
                    )
                    ToolTab.CONSOLE -> ConsoleLogsScreen(
                        state = state,
                        onClearLogs = vm::clearLogs
                    )
                }
            }
        }
    }
}

private fun tabIcon(tab: ToolTab): ImageVector = when (tab) {
    ToolTab.RADAR -> Icons.Default.Radar
    ToolTab.PORTS -> Icons.Default.Search
    ToolTab.VULNS -> Icons.Default.Security
    ToolTab.MITM -> Icons.Default.Visibility
    ToolTab.NET_TOOLS -> Icons.Default.VerifiedUser
    ToolTab.CRACKER -> Icons.Default.Key
    ToolTab.WIFI -> Icons.Default.Wifi
    ToolTab.FORGER -> Icons.Default.Bolt
    ToolTab.METASPLOIT -> Icons.Default.Memory
    ToolTab.CONSOLE -> Icons.Default.Terminal
}
