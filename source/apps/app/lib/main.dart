import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mzizi_api/api.dart';

import 'core/config/app_config.dart';
import 'core/theme/mzizi_theme.dart';
import 'presentation/routers/go_router.dart';
import 'presentation/i18n/copy.dart';
import 'presentation/i18n/strings.dart';
import 'presentation/user/user_store.dart';

/// Scaffolded by Dryv once; this file belongs to the app.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await MziziApi.initialize(baseUri: Uri.parse(AppConfig.apiBaseUrl));
  await UserStore.instance.load();
  await Future.wait([
    loadCopy(UserStore.instance.language),
    loadCountry(UserStore.instance.language),
  ]);
  runApp(const ProviderScope(child: MziziAppApp()));
}

/// Counts how many times the wording was reloaded, so screens rebuild when a language's copy arrives.
final copyRevisionProvider = StateProvider<int>((ref) => 0);

class MziziAppApp extends ConsumerWidget {
  const MziziAppApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final revision = ref.watch(copyRevisionProvider);
    ref.listen<String>(languageProvider, (_, next) async {
      await loadCopy(next);
      ref.read(copyRevisionProvider.notifier).state++;
    });
    uiLanguage = language;
    return ListenableBuilder(
      listenable: UserStore.instance,
      builder: (context, _) => MaterialApp.router(
        title: 'Mzizi',
        debugShowCheckedModeBanner: false,

        theme: _tuned(buildMziziLightTheme()),
        darkTheme: _tuned(buildMziziDarkTheme()),
        builder: (context, child) {
          final dark = Theme.of(context).brightness == Brightness.dark;
          return AnnotatedRegion<SystemUiOverlayStyle>(
            value:
                (dark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark)
                    .copyWith(
                      statusBarColor: Colors.transparent,
                      systemNavigationBarColor: Colors.transparent,
                    ),
            child: KeyedSubtree(
              key: ValueKey('$language-$revision'),
              child: child ?? const SizedBox.shrink(),
            ),
          );
        },
        themeMode: UserStore.instance.themeMode,
        routerConfig: appRouter,
      ),
    );
  }
}

/// The generated theme plus the few app-level choices: flat app bars that keep the page colour (no tinted bar).
ThemeData _tuned(ThemeData base) => base.copyWith(
  appBarTheme: AppBarTheme(
    backgroundColor: base.colorScheme.surface,
    surfaceTintColor: Colors.transparent,
    scrolledUnderElevation: 0,
    elevation: 0,
  ),
);
