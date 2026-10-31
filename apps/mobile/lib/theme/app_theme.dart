import 'package:flutter/material.dart';

import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData get light => _theme(Brightness.light);
  static ThemeData get dark => _theme(Brightness.dark);

  static ThemeData _theme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final scheme =
        ColorScheme.fromSeed(
          seedColor: isDark ? AppColors.darkPrimary : AppColors.primary,
          brightness: brightness,
        ).copyWith(
          primary: isDark ? AppColors.darkPrimary : AppColors.primary,
          onPrimary: isDark
              ? AppColors.lightForeground
              : AppColors.lightSurface,
          primaryContainer: isDark
              ? AppColors.darkSurfaceContainer
              : AppColors.lightSurfaceContainer,
          onPrimaryContainer: isDark
              ? AppColors.darkForeground
              : AppColors.lightForeground,
          secondary: isDark ? AppColors.darkAccent : AppColors.accent,
          onSecondary: AppColors.lightSurface,
          secondaryContainer: isDark
              ? AppColors.darkSurfaceContainer
              : AppColors.lightSurfaceContainer,
          onSecondaryContainer: isDark
              ? AppColors.darkForeground
              : AppColors.lightForeground,
          tertiary: isDark ? AppColors.warning : AppColors.amber,
          onTertiary: AppColors.lightForeground,
          error: isDark ? AppColors.darkError : AppColors.lightError,
          onError: AppColors.lightSurface,
          surface: isDark
              ? AppColors.darkBackground
              : AppColors.lightBackground,
          onSurface: isDark
              ? AppColors.darkForeground
              : AppColors.lightForeground,
          surfaceContainerLowest: isDark
              ? AppColors.darkBackground
              : AppColors.lightBackground,
          surfaceContainerLow: isDark
              ? AppColors.darkSurface
              : AppColors.lightSurface,
          surfaceContainer: isDark
              ? AppColors.darkSurface
              : AppColors.lightSurface,
          surfaceContainerHigh: isDark
              ? AppColors.darkSurfaceContainer
              : AppColors.lightSurfaceContainer,
          surfaceContainerHighest: isDark
              ? AppColors.darkSurfaceContainer
              : AppColors.lightSurfaceContainer,
          onSurfaceVariant: isDark ? AppColors.darkMuted : AppColors.lightMuted,
          outline: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          outlineVariant: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          surfaceTint: isDark ? AppColors.darkPrimary : AppColors.primary,
          inverseSurface: isDark
              ? AppColors.lightSurface
              : AppColors.lightForeground,
          onInverseSurface: isDark
              ? AppColors.lightForeground
              : AppColors.lightSurface,
        );
    final baseText =
        TextTheme(
          displayLarge: const TextStyle(
            fontSize: 36,
            height: 1.12,
            fontWeight: FontWeight.w700,
          ),
          displayMedium: const TextStyle(
            fontSize: 32,
            height: 1.15,
            fontWeight: FontWeight.w700,
          ),
          displaySmall: const TextStyle(
            fontSize: 28,
            height: 1.2,
            fontWeight: FontWeight.w700,
          ),
          headlineLarge: const TextStyle(
            fontSize: 26,
            height: 1.2,
            fontWeight: FontWeight.w700,
          ),
          headlineMedium: const TextStyle(
            fontSize: 22,
            height: 1.25,
            fontWeight: FontWeight.w700,
          ),
          headlineSmall: const TextStyle(
            fontSize: 18,
            height: 1.3,
            fontWeight: FontWeight.w600,
          ),
          titleLarge: const TextStyle(
            fontSize: 18,
            height: 1.3,
            fontWeight: FontWeight.w600,
          ),
          titleMedium: const TextStyle(
            fontSize: 16,
            height: 1.35,
            fontWeight: FontWeight.w600,
          ),
          titleSmall: const TextStyle(
            fontSize: 14,
            height: 1.35,
            fontWeight: FontWeight.w600,
          ),
          bodyLarge: const TextStyle(fontSize: 16, height: 1.5),
          bodyMedium: const TextStyle(fontSize: 14, height: 1.45),
          bodySmall: const TextStyle(fontSize: 12, height: 1.4),
          labelLarge: const TextStyle(
            fontSize: 14,
            height: 1.2,
            fontWeight: FontWeight.w600,
          ),
          labelMedium: const TextStyle(
            fontSize: 12,
            height: 1.2,
            fontWeight: FontWeight.w500,
          ),
          labelSmall: const TextStyle(
            fontSize: 11,
            height: 1.2,
            fontWeight: FontWeight.w500,
          ),
        ).apply(
          fontFamily: 'sans-serif',
          bodyColor: scheme.onSurface,
          displayColor: scheme.onSurface,
        );
    final text = baseText.copyWith(
      displayLarge: baseText.displayLarge?.copyWith(fontFamily: 'serif'),
      displayMedium: baseText.displayMedium?.copyWith(fontFamily: 'serif'),
      displaySmall: baseText.displaySmall?.copyWith(fontFamily: 'serif'),
      headlineLarge: baseText.headlineLarge?.copyWith(fontFamily: 'serif'),
      headlineMedium: baseText.headlineMedium?.copyWith(fontFamily: 'serif'),
      headlineSmall: baseText.headlineSmall?.copyWith(fontFamily: 'serif'),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: scheme.surface,
      fontFamily: 'sans-serif',
      fontFamilyFallback: const ['Arial'],
      iconTheme: IconThemeData(size: 20, color: scheme.onSurfaceVariant),
      textTheme: text,
      appBarTheme: AppBarTheme(
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        elevation: 0,
        centerTitle: false,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: text.titleLarge?.copyWith(color: scheme.onSurface),
      ),
      cardTheme: CardThemeData(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: scheme.outlineVariant),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: scheme.surfaceContainerLow,
        hintStyle: TextStyle(color: scheme.onSurfaceVariant),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: scheme.outlineVariant),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: scheme.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: scheme.primary, width: 1.5),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(48, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          textStyle: text.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(48, 48),
          foregroundColor: scheme.primary,
          side: BorderSide(color: scheme.outline),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          textStyle: text.labelLarge,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: scheme.surface,
        indicatorColor: scheme.primary.withValues(alpha: .12),
        labelTextStyle: WidgetStatePropertyAll(text.labelSmall),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected)
                ? scheme.primary
                : scheme.onSurfaceVariant,
          ),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: scheme.outlineVariant,
        thickness: 1,
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: scheme.surface,
        modalBackgroundColor: scheme.surface,
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: scheme.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: scheme.surfaceContainerHighest,
        selectedColor: scheme.primary.withValues(alpha: .12),
        side: BorderSide(color: scheme.outlineVariant),
        labelStyle: text.labelMedium,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
