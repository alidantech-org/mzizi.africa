import 'package:geolocator/geolocator.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/brand/mz_logo.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
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
  final _query = TextEditingController();
  int _page = 0;
  String _status = '';
  bool _busy = false;
  List<LocalityLocalityUnit> _matches = const [];

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
    _query.dispose();
    super.dispose();
  }

  Future<void> _choose(LocalityUnitLite place) async {
    await UserStore.instance.setPlace(place.id, place.name, place.kind);
    await UserStore.instance.finishOnboarding();
    if (mounted) context.go('/');
  }

  Future<void> _locate() async {
    setState(() {
      _busy = true;
      _status = 'Finding where you are…';
    });
    try {
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        throw StateError('denied');
      }
      final p = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.low,
          timeLimit: Duration(seconds: 12),
        ),
      );
      final result = await LocalityFeature(MziziApi.connection).resolveLocality(
        input: LocalityPositionInput(
          latitude: p.latitude,
          longitude: p.longitude,
        ),
      );
      final profile = result.dataOrNull;
      if (profile == null) throw StateError('none');
      await _choose(
        LocalityUnitLite(
          profile.place.featureId,
          profile.place.name,
          profile.place.kindCode,
        ),
      );
    } catch (_) {
      if (mounted) {
        setState(() {
          _busy = false;
          _status =
              'We could not read your location. You can allow it in settings, or search for your place below.';
        });
      }
    }
  }

  Future<void> _search(String text) async {
    if (text.trim().length < 2) {
      setState(() => _matches = const []);
      return;
    }
    final result = await LocalityFeature(MziziApi.connection).searchLocalities(
      input: LocalitySearchInput(query: text.trim(), languageCode: 'en'),
    );
    if (mounted) {
      setState(() => _matches = result.dataOrNull?.places ?? const []);
    }
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
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      children: [
        Tx('Where are you?', style: text.headlineMedium),
        const SizedBox(height: 8),
        Tx(
          'We use your place to show the numbers and leaders that matter to you. Your location stays on this phone.',
          style: text.bodyMedium,
        ),
        const SizedBox(height: 20),
        FilledButton.icon(
          onPressed: _busy ? null : _locate,
          icon: MzIcon('locate', color: Colors.white),
          label: Tx(t(context, 'Use my location')),
        ),
        if (_status.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Tx(_status, style: text.bodySmall),
          ),
        const SizedBox(height: 20),
        Tx('Or search for a county, town or ward', style: text.labelLarge),
        const SizedBox(height: 8),
        TextField(
          controller: _query,
          onChanged: _search,
          decoration: InputDecoration(
            hintText: t(context, 'For example Kisumu or Kibera'),
            prefixIcon: MzIcon('search'),
            filled: true,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(32),
            ),
          ),
        ),
        const SizedBox(height: 8),
        for (final m in _matches.take(8))
          GlassCard(
            margin: const EdgeInsets.only(bottom: 6),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            onTap: () => _choose(LocalityUnitLite(m.featureId, m.name, m.kindCode)),
            child: Row(
              children: [
                MzIcon('pin', size: 20),
                const SizedBox(width: 10),
                Expanded(child: Tx(m.name)),
                Tx(m.kindLabel, style: text.labelSmall),
              ],
            ),
          ),
        TextButton(
          onPressed: () async {
            await UserStore.instance.finishOnboarding();
            if (context.mounted) context.go('/');
          },
          child: Tx(t(context, 'Not now, show me Kenya')),
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
