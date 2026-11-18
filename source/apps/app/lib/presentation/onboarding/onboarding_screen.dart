import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/brand/mz_logo.dart';
import 'package:mzizi_app/presentation/home/locate.dart';
import 'package:mzizi_app/presentation/home/place_picker.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';

/// First launch: a welcome, what the app does, then "where are you?" (device location or a search). Choosing a place
/// finishes onboarding and opens the home screen for that place.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pages = PageController();
  int _page = 0;
  String _status = '';

  static const _slides = <({String icon, String title, String body})>[
    (
      icon: 'tree',
      title: 'Welcome to Mzizi',
      body:
          'Mzizi means root. We trace public life in Kenya back to its source: who leads, what is built and where the money goes.',
    ),
    (
      icon: 'chart',
      title: 'Your place, in numbers',
      body:
          'See how your county, constituency or ward compares with the rest of the country: people, projects, votes and funding.',
    ),
    (
      icon: 'trophy',
      title: 'Leaders you can check',
      body:
          'Find who represents you, how they voted and what they delivered. Every figure shows where it came from.',
    ),
  ];

  @override
  void dispose() {
    _pages.dispose();
    super.dispose();
  }

  Future<void> _choose(LocalityUnitLite place) async {
    await UserStore.instance.setPlace(place.id, place.name, place.kind);
    await UserStore.instance.finishOnboarding();
    if (mounted) context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final last = _page == _slides.length;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Row(
                children: [
                  const MzLogo(size: 32),
                  const Spacer(),
                  if (!last)
                    TextButton(
                      onPressed: () => _pages.animateToPage(
                        _slides.length,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOut,
                      ),
                      child: Tx(t(context, 'Skip')),
                    ),
                ],
              ),
            ),
            Expanded(
              child: PageView(
                controller: _pages,
                onPageChanged: (i) => setState(() => _page = i),
                children: [
                  for (final s in _slides)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Theme.of(
                                context,
                              ).colorScheme.primary.withValues(alpha: 0.12),
                            ),
                            child: Center(
                              child: MzIcon(
                                s.icon,
                                size: 56,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          Tx(
                            s.title,
                            textAlign: TextAlign.center,
                            style: text.headlineMedium,
                          ),
                          const SizedBox(height: 12),
                          Tx(
                            s.body,
                            textAlign: TextAlign.center,
                            style: text.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                  _whereAreYou(context),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
              child: Row(
                children: [
                  for (var i = 0; i <= _slides.length; i++)
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      margin: const EdgeInsets.only(right: 6),
                      width: i == _page ? 22 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        color: i == _page
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).dividerColor,
                      ),
                    ),
                  const Spacer(),
                  if (!last)
                    FilledButton(
                      onPressed: () => _pages.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOut,
                      ),
                      child: Tx(t(context, 'Next')),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _whereAreYou(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Tx('Where are you?', style: text.headlineMedium),
              const SizedBox(height: 6),
              Tx(
                'We use your place to show the numbers and leaders that matter to you. Your location stays on this phone.',
                style: text.bodyMedium,
              ),
              if (_status.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Tx(_status, style: text.bodySmall),
                ),
            ],
          ),
        ),
        Expanded(
          child: PlacePicker(
            onLocate: () async {
              final here = await locateMe();
              if (here != null) {
                await _choose(LocalityUnitLite(here.id, here.name, here.kind));
              } else if (mounted) {
                setState(
                  () => _status =
                      'We could not read your location. You can allow it in settings, or search for your place below.',
                );
              }
            },
            onPicked: (p) => _choose(LocalityUnitLite(p.id, p.name, p.kind)),
          ),
        ),
        Center(
          child: TextButton(
            onPressed: () async {
              await UserStore.instance.finishOnboarding();
              if (context.mounted) context.go('/');
            },
            child: Tx('Not now, show me Kenya'),
          ),
        ),
      ],
    );
  }
}

/// The three things the store keeps about a chosen place.
class LocalityUnitLite {
  const LocalityUnitLite(this.id, this.name, this.kind);
  final String id;
  final String name;
  final String kind;
}
