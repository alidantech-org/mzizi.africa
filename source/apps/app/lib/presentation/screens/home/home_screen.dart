import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/pages/place_search_box.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';
import 'package:mzizi_app/presentation/widgets/reveal.dart';

/// The first screen, at `/`: the pitch, a location button and a name search. Scaffolded by Dryv once; hand-built.
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _state = 'idle';

  /// Reads the device position (only when pressed) and opens the profile of the place there.
  Future<void> _locate() async {
    setState(() => _state = 'locating');
    try {
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        throw StateError('denied');
      }
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.low,
          timeLimit: Duration(seconds: 12),
        ),
      );
      if (!mounted) return;
      setState(() => _state = 'idle');
      context.go(
        '${AppRoutes.placeProfile}?lat=${position.latitude.toStringAsFixed(5)}&lng=${position.longitude.toStringAsFixed(5)}',
      );
    } catch (_) {
      if (mounted) setState(() => _state = 'denied');
    }
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final text = Theme.of(context).textTheme;
    final saved = ref.watch(savedProvider);
    final kept = [...saved.places, ...saved.spots];
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 32, 20, 24),
      children: [
        Text(
          'MZIZI',
          style: text.labelLarge?.copyWith(
            color: MziziTokens.clay,
            letterSpacing: 4,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          tr(language, 'heroTitle'),
          style: text.displaySmall?.copyWith(
            fontFamily: 'Georgia',
            height: 1.1,
          ),
        ),
        const SizedBox(height: 14),
        Text(tr(language, 'heroBody'), style: text.bodyLarge),
        const SizedBox(height: 28),
        SizedBox(
          height: 52,
          child: FilledButton.icon(
            style: FilledButton.styleFrom(
              backgroundColor: MziziTokens.clay,
              foregroundColor: MziziTokens.cream,
            ),
            onPressed: _state == 'locating' ? null : _locate,
            icon: const Icon(Icons.my_location),
            label: Text(
              tr(language, _state == 'locating' ? 'locating' : 'useLocation'),
            ),
          ),
        ),
        if (_state == 'denied')
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Text(tr(language, 'locationDenied'), style: text.bodySmall),
          ),
        const SizedBox(height: 16),
        const PlaceSearchBox(),
        if (kept.isNotEmpty) ...[
          const SizedBox(height: 22),
          Text(tr(language, 'myPlaces'), style: text.titleMedium),
          const SizedBox(height: 8),
          SizedBox(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                for (final item in kept)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      avatar: Icon(
                        item.latitude == null ? Icons.star : Icons.my_location,
                        size: 16,
                      ),
                      label: Text(item.title),
                      onPressed: () => context.go(
                        item.latitude == null
                            ? '${AppRoutes.placeProfile}?featureId=${item.id}'
                            : '${AppRoutes.placeProfile}?lat=${item.latitude}&lng=${item.longitude}',
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 28),
        for (final card in [
          (Icons.groups_outlined, 'representatives', AppRoutes.placeSearch),
          (
            Icons.account_balance_outlined,
            'procurement',
            AppRoutes.placeSearch,
          ),
          (Icons.menu_book_outlined, 'sources', AppRoutes.sourceBrowse),
        ])
          Reveal(
            order: 2,
            child: Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                leading: Icon(card.$1, color: MziziTokens.calabash),
                title: Text(tr(language, card.$2)),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.go(card.$3),
              ),
            ),
          ),
        const SizedBox(height: 8),
        Text(tr(language, 'sampleNotice'), style: text.bodySmall),
      ],
    );
  }
}
