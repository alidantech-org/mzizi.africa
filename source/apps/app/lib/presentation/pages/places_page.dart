import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/pages/place_search_box.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Name search results at `/place-search?q=`. Hand-built.
class PlacesPage extends ConsumerWidget {
  const PlacesPage({super.key, required this.query});

  final String query;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        PlaceSearchBox(key: ValueKey(query), initial: query),
        const SizedBox(height: 16),
        if (query.trim().length >= 2)
          AsyncPage<LocalityLocalityMatches>(
            reloadKey: query,
            load: (lang) =>
                LocalityFeature(MziziApi.connection).searchLocalities(
                  input: LocalitySearchInput(
                    query: query.trim(),
                    languageCode: lang,
                  ),
                ),
            builder: (context, matches) => matches.places.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text(tr(language, 'noResults')),
                  )
                : Column(
                    children: [
                      for (final place in matches.places)
                        Card(
                          child: ListTile(
                            title: Text(
                              place.name,
                              style: const TextStyle(
                                fontFamily: 'Georgia',
                                fontSize: 18,
                              ),
                            ),
                            subtitle: Text(place.kindLabel),
                            trailing: MzIcon('chevron-right'),
                            onTap: () => context.push(
                              '${AppRoutes.placeProfile}?featureId=${place.featureId}',
                            ),
                          ),
                        ),
                    ],
                  ),
          ),
      ],
    );
  }
}
