import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mzizi_api/api.dart';

import 'core/config/app_config.dart';
import 'core/theme/mzizi_theme.dart';
import 'presentation/routers/go_router.dart';

/// Scaffolded by Dryv once; this file belongs to the app.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await MziziApi.initialize(baseUri: Uri.parse(AppConfig.apiBaseUrl));
  runApp(const ProviderScope(child: MziziAppApp()));
}

class MziziAppApp extends StatelessWidget {
  const MziziAppApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Mzizi App',
      theme: buildMziziLightTheme(),
      darkTheme: buildMziziDarkTheme(),
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
    );
  }
}
