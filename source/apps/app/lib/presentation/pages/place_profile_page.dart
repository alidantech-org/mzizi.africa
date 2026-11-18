import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/pages/official_card.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:mzizi_app/presentation/widgets/keep_buttons.dart';
import 'package:mzizi_app/presentation/widgets/place_map.dart';
import 'package:mzizi_app/presentation/widgets/reveal.dart';
import 'package:latlong2/latlong.dart';

String _money(double? amount, String? currency) {
  if (amount == null) return '—';
  final compact = amount >= 1e9
      ? '${(amount / 1e9).toStringAsFixed(1)}B'
      : amount >= 1e6
      ? '${(amount / 1e6).toStringAsFixed(1)}M'
      : amount >= 1e3
      ? '${(amount / 1e3).toStringAsFixed(0)}K'
      : amount.toStringAsFixed(0);
  return '${currency ?? ''} $compact'.trim();
}

/// Who serves a place: the chain of units, the officials, procurement and what is missing. Opens by feature
/// (`?featureId=`) or by device position (`?lat=&lng=`). Hand-built.
class PlaceProfilePage extends ConsumerWidget {
  const PlaceProfilePage({
    super.key,
    required this.featureId,
    required this.latitude,
    required this.longitude,
  });

  final String? featureId;
  final double? latitude;
  final double? longitude;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final text = Theme.of(context).textTheme;
    return AsyncPage<LocalityLocalityProfile>(
      reloadKey: '$featureId|$latitude|$longitude',
      load: (lang) {
        final feature = LocalityFeature(MziziApi.connection);
        if (featureId != null) {
          return feature.getLocality(
            featureId: featureId!,
            input: LocalityPlaceInput(
              featureId: featureId!,
              languageCode: lang,
            ),
          );
        }
        return feature.resolveLocality(
          input: LocalityPositionInput(
            latitude: latitude ?? 0,
            longitude: longitude ?? 0,
            languageCode: lang,
          ),
        );
      },
      builder: (context, profile) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              for (var i = 0; i < profile.chain.length - 1; i++) ...[
                if (i > 0) const Text(' › '),
                GestureDetector(
                  onTap: () => context.go(
                    '${AppRoutes.placeProfile}?featureId=${profile.chain[i].featureId}',
                  ),
                  child: Text(
                    profile.chain[i].name,
                    style: text.bodySmall?.copyWith(
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
              if (profile.chain.length > 1) const Text(' › '),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            profile.place.name,
            style: text.displaySmall?.copyWith(fontFamily: 'Georgia'),
          ),
          const SizedBox(height: 6),
          Chip(label: Text(profile.place.kindLabel)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              KeepChip(
                kind: SavedKind.place,
                item: SavedItem(
                  id: profile.place.featureId,
                  title: profile.place.name,
                  subtitle: profile.place.kindLabel,
                ),
                onLabel: tr(language, 'savedPlace'),
                offLabel: tr(language, 'savePlace'),
                icon: 'sparkle',
              ),
              if (latitude != null && longitude != null)
                KeepChip(
                  kind: SavedKind.spot,
                  item: SavedItem(
                    id: '${latitude!.toStringAsFixed(4)},${longitude!.toStringAsFixed(4)}',
                    title: profile.place.name,
                    featureId: profile.place.featureId,
                    latitude: latitude,
                    longitude: longitude,
                  ),
                  onLabel: tr(language, 'spotSaved'),
                  offLabel: tr(language, 'saveSpot'),
                  icon: 'locate',
                ),
            ],
          ),
          const SizedBox(height: 16),
          Reveal(
            order: 1,
            child: PlaceMap(
              key: ValueKey('${profile.place.featureId}|$latitude|$longitude'),
              units: [
                for (final unit in profile.chain)
                  MapUnit(featureId: unit.featureId, name: unit.name),
              ],
              position: latitude != null && longitude != null
                  ? LatLng(latitude!, longitude!)
                  : null,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            tr(language, 'representatives'),
            style: text.titleLarge?.copyWith(fontFamily: 'Georgia'),
          ),
          const SizedBox(height: 10),
          if (profile.officials.isEmpty) Text(tr(language, 'notRecorded')),
          for (final holder in profile.officials)
            OfficialCard(holder: holder, language: language),
          const SizedBox(height: 16),
          Text(
            tr(language, 'procurement'),
            style: text.titleLarge?.copyWith(fontFamily: 'Georgia'),
          ),
          const SizedBox(height: 10),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${profile.procurement.count}',
                              style: text.headlineMedium?.copyWith(
                                fontFamily: 'Georgia',
                              ),
                            ),
                            Text(
                              tr(language, 'contracts'),
                              style: text.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _money(
                                profile.procurement.totalAmount,
                                profile.procurement.currency,
                              ),
                              style: text.headlineMedium?.copyWith(
                                fontFamily: 'Georgia',
                              ),
                            ),
                            Text(
                              tr(language, 'totalAwarded'),
                              style: text.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 28),
                  for (final item in profile.procurement.recent)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item.title, style: text.titleSmall),
                                Text(
                                  [
                                    if (item.awardedTo != null)
                                      '${tr(language, 'awardedTo')} ${item.awardedTo}',
                                    if (item.year != null) '${item.year}',
                                    if (item.status != null) item.status!,
                                  ].join(' · '),
                                  style: text.bodySmall,
                                ),
                                if (item.evidence.isNotEmpty)
                                  TextButton(
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      minimumSize: const Size(0, 32),
                                    ),
                                    onPressed: () => context.go(
                                      '${AppRoutes.evidenceView}?citationId=${item.evidence.first.citationId}',
                                    ),
                                    child: Text(
                                      '${tr(language, 'seeEvidence')} ›',
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          Text(
                            _money(item.amount, item.currency),
                            style: text.titleMedium?.copyWith(
                              fontFamily: 'Georgia',
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          if (profile.gaps.isNotEmpty) ...[
            const SizedBox(height: 16),
            Card(
              color: MziziTokens.calabash.withValues(alpha: 0.12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(tr(language, 'gaps'), style: text.titleSmall),
                    const SizedBox(height: 6),
                    for (final gap in profile.gaps)
                      Text('• $gap', style: text.bodySmall),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
