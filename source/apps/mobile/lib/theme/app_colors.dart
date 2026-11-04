import 'package:flutter/material.dart';

/// Warm, evidence-led visual identity shared by every mobile screen.
/// Geography layers keep their own data colors; these tokens style the UI.
abstract final class AppColors {
  static const primary = Color(0xFF302821);
  static const darkPrimary = Color(0xFFF1E7D7);
  static const accent = Color(0xFFB95D3B);
  static const darkAccent = Color(0xFFE38A66);
  static const brand = Color(0xFF7B4B2A);
  static const amber = Color(0xFFC48932);
  static const tan = Color(0xFFD7A068);

  static const lightBackground = Color(0xFFF1EBDF);
  static const lightSurface = Color(0xFFFBF6EE);
  static const lightForeground = Color(0xFF302821);
  static const lightMuted = Color(0xFF786A5C);
  static const lightBorder = Color(0xFFE2D5C2);
  static const lightSurfaceContainer = Color(0xFFEAE1D2);

  static const darkBackground = Color(0xFF211C18);
  static const darkSurface = Color(0xFF2D2620);
  static const darkForeground = Color(0xFFF3EBDD);
  static const darkMuted = Color(0xFFC0AE98);
  static const darkBorder = Color(0xFF514438);
  static const darkSurfaceContainer = Color(0xFF3B3129);

  static const lightError = Color(0xFFB94D37);
  static const darkError = Color(0xFFE68168);
  static const success = Color(0xFFA4B17B);
  static const lightSuccess = Color(0xFF66734A);
  static const warning = Color(0xFFE0AD59);
  static const lightWarning = Color(0xFF98621B);
}

extension MziziColorRoles on BuildContext {
  ColorScheme get colors => Theme.of(this).colorScheme;
  Color get successColor => Theme.of(this).brightness == Brightness.dark
      ? AppColors.success
      : AppColors.lightSuccess;
  Color get warningColor => Theme.of(this).brightness == Brightness.dark
      ? AppColors.warning
      : AppColors.lightWarning;
  Color get mapOverlay => colors.inverseSurface.withValues(alpha: .94);
  Color get mapOverlayText => colors.onInverseSurface;
  Color get mapOverlayMuted => colors.onInverseSurface.withValues(alpha: .72);
}
