import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mzizi_api/api.dart';

import 'core/config/app_config.dart';
import 'core/theme/mzizi_theme.dart';
import 'presentation/routers/go_router.dart';
import 'presentation/user/user_store.dart';

/// Scaffolded by Dryv once; this file belongs to the app.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await MziziApi.initialize(baseUri: Uri.parse(AppConfig.apiBaseUrl));
  await UserStore.instance.load();
  runApp(const ProviderScope(child: MziziAppApp()));
}

class MziziAppApp extends StatelessWidget {
  const MziziAppApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: UserStore.instance,
      builder: (context, _) => MaterialApp.router(
        title: 'Mzizi',
        theme: buildMziziLightTheme(),
        darkTheme: buildMziziDarkTheme(),
        themeMode: UserStore.instance.themeMode,
        routerConfig: appRouter,
      ),
    );
  }
}
