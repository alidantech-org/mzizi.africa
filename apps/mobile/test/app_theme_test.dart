import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mzizi_mobile/theme/app_colors.dart';
import 'package:mzizi_mobile/theme/app_theme.dart';

void main() {
  test('light and dark themes use the shared semantic palette', () {
    expect(AppTheme.light.colorScheme.primary, AppColors.primary);
    expect(AppTheme.light.colorScheme.secondary, AppColors.accent);
    expect(AppTheme.dark.colorScheme.primary, AppColors.darkPrimary);
    expect(AppTheme.dark.colorScheme.secondary, AppColors.darkAccent);
    expect(AppTheme.light.scaffoldBackgroundColor, AppColors.lightBackground);
    expect(AppTheme.dark.scaffoldBackgroundColor, AppColors.darkBackground);
    expect(AppTheme.light.textTheme.bodyMedium?.fontFamily, 'sans-serif');
    expect(AppTheme.light.textTheme.headlineMedium?.fontFamily, 'serif');
    expect(AppTheme.dark.textTheme.bodyMedium?.fontFamily, 'sans-serif');
  });

  testWidgets('app defaults to the light visual theme', (tester) async {
    await tester.pumpWidget(const MziziThemeHarness());
    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.light);
    expect(app.theme?.colorScheme.primary, AppColors.primary);
    expect(app.darkTheme?.colorScheme.primary, AppColors.darkPrimary);
  });
}

class MziziThemeHarness extends StatelessWidget {
  const MziziThemeHarness({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    theme: AppTheme.light,
    darkTheme: AppTheme.dark,
    themeMode: ThemeMode.light,
    home: const Scaffold(body: SizedBox.shrink()),
  );
}
