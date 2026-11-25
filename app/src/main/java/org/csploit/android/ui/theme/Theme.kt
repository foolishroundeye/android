package org.csploit.android.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ObsidianBg = Color(0xFF020617)
val SlateSurface = Color(0xFF0F172A)
val SlateCard = Color(0xFF1E293B)
val SlateBorder = Color(0xFF334155)
val CrimsonPrimary = Color(0xFFDC2626)
val CrimsonLight = Color(0xFFF87171)
val EmeraldOnline = Color(0xFF10B981)
val AmberWarn = Color(0xFFF59E0B)
val CyanInfo = Color(0xFF38BDF8)
val TextPrimary = Color(0xFFF1F5F9)
val TextMuted = Color(0xFF94A3B8)

private val CSploitColorScheme = darkColorScheme(
    primary = CrimsonPrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF450A0A),
    onPrimaryContainer = CrimsonLight,
    secondary = EmeraldOnline,
    onSecondary = Color.Black,
    background = ObsidianBg,
    onBackground = TextPrimary,
    surface = SlateSurface,
    onSurface = TextPrimary,
    surfaceVariant = SlateCard,
    onSurfaceVariant = TextMuted,
    outline = SlateBorder,
    error = Color(0xFFEF4444)
)

@Composable
fun CSploitTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = CSploitColorScheme,
        content = content
    )
}
