import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/core/config/app_config.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/home/place_switcher.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';

/// The Settings tab: language, appearance, "my place", what is saved, where the data comes from and a reset.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final saved = ref.watch(savedProvider);
    final text = Theme.of(context).textTheme;
    return ListenableBuilder(
      listenable: UserStore.instance,
      builder: (context, _) {
        final me = UserStore.instance;
        return SafeArea(
          bottom: false,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: Tx(
                  'Profile',
                  style: text.headlineLarge?.copyWith(fontFamily: 'Georgia'),
                ),
              ),
              const SizedBox(height: 16),
              _Section(
                title: 'My place',
                children: [
                  ListTile(
                    leading: MzIcon('pin'),
                    title: Text(me.placeName ?? t(context, 'No place chosen')),
                    subtitle: Text(
                      me.placeId == null
                          ? t(
                              context,
                              'Choose one to see how it compares with the rest of Kenya.',
                            )
                          : (me.boardName != null && me.boardId != me.placeId
                                ? tf(context, 'Ranked as part of {}', [
                                    me.boardName,
                                  ])
                                : t(context, 'Your region')),
                    ),
                    trailing: TextButton(
                      onPressed: () => showPlaceSwitcher(context),
                      child: Tx(me.placeId == null ? 'Choose' : 'Change'),
                    ),
                  ),
                  if (me.placeId != null)
                    ListTile(
                      leading: MzIcon('close'),
                      title: Tx('Forget my place'),
                      onTap: () => me.clearPlace(),
                    ),
                ],
              ),
              _Section(
                title: 'Language',
                children: [
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: SizedBox(
                      width: double.infinity,
                      child: SegmentedButton<String>(
                        showSelectedIcon: false,
                        segments: const [
                          ButtonSegment(value: 'en', label: Text('English')),
                          ButtonSegment(value: 'sw', label: Text('Kiswahili')),
                        ],
                        selected: {language},
                        onSelectionChanged: (c) {
                          ref.read(languageProvider.notifier).state = c.first;
                          me.setLanguage(c.first);
                        },
                      ),
                    ),
                  ),
                ],
              ),
              _Section(
                title: 'Appearance',
                children: [
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: SizedBox(
                      width: double.infinity,
                      child: SegmentedButton<ThemeMode>(
                        showSelectedIcon: false,
                        segments: [
                          ButtonSegment(
                            value: ThemeMode.system,
                            label: Tx('Auto'),
                            icon: MzIcon('settings', size: 16),
                          ),
                          ButtonSegment(
                            value: ThemeMode.light,
                            label: Tx('Light'),
                            icon: MzIcon('sun', size: 16),
                          ),
                          ButtonSegment(
                            value: ThemeMode.dark,
                            label: Tx('Dark'),
                            icon: MzIcon('moon', size: 16),
                          ),
                        ],
                        selected: {me.themeMode},
                        onSelectionChanged: (c) => me.setThemeMode(c.first),
                      ),
                    ),
                  ),
                ],
              ),
              _Section(
                title: 'Saved',
                children: [
                  ListTile(
                    leading: MzIcon('heart'),
                    title: Tx('Saved places, spots and leaders'),
                    subtitle: Text(
                      tf(context, '{} kept on this phone', [saved.count]),
                    ),
                    trailing: MzIcon('chevron-right', size: 18),
                    onTap: () => context.push('/saved'),
                  ),
                ],
              ),
              _Section(
                title: 'About the data',
                children: [
                  ListTile(
                    leading: MzIcon('book'),
                    title: Tx('Sources and evidence'),
                    subtitle: Tx('Where every figure comes from.'),
                    trailing: MzIcon('chevron-right', size: 18),
                    onTap: () => context.push('/source-browse'),
                  ),
                  ListTile(
                    leading: MzIcon('info'),
                    title: Tx('Sample data'),
                    subtitle: Tx(
                      'Some places and people shown are development samples and are labelled where they appear.',
                    ),
                  ),
                  ListTile(
                    leading: MzIcon('locate'),
                    title: Tx('Privacy'),
                    subtitle: Tx(
                      'Your place and saved items stay on this phone. Location is read only when you ask.',
                    ),
                  ),
                ],
              ),
              _Section(
                title: 'About',
                children: [
                  ListTile(
                    leading: MzIcon('tree'),
                    title: const Text('Mzizi'),
                    subtitle: Text(
                      '${kDebugMode ? t(context, 'Debug build') : t(context, 'Release build')} · ${Uri.parse(AppConfig.apiBaseUrl).host}',
                    ),
                  ),
                  ListTile(
                    leading: MzIcon('close'),
                    title: Tx('Show the welcome screens again'),
                    onTap: () async {
                      final ok = await showDialog<bool>(
                        context: context,
                        builder: (d) => AlertDialog(
                          title: Tx('Start again?'),
                          content: Tx(
                            'You will see the welcome screens and choose a place again.',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(d, false),
                              child: Tx('Cancel'),
                            ),
                            FilledButton(
                              onPressed: () => Navigator.pop(d, true),
                              child: Tx('Start again'),
                            ),
                          ],
                        ),
                      );
                      if (ok == true) await me.resetOnboarding();
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.children});
  final String title;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 0, 8, 6),
            child: Text(
              t(context, title).toUpperCase(),
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                letterSpacing: 1.2,
                fontWeight: FontWeight.w700,
                color: scheme.primary,
              ),
            ),
          ),
          Material(
            color: Theme.of(context).brightness == Brightness.dark
                ? scheme.surfaceContainerHigh
                : scheme.surfaceContainerLowest,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(22),
              side: BorderSide(
                color: scheme.outlineVariant.withValues(alpha: 0.5),
              ),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(children: children),
          ),
        ],
      ),
    );
  }
}
