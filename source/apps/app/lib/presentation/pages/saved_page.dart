import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';
import 'package:mzizi_app/presentation/widgets/reveal.dart';

/// What the visitor keeps on this device: places, GPS spots, leaders followed and projects liked. Hand-built.
class SavedPage extends ConsumerWidget {
  const SavedPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final saved = ref.watch(savedProvider);
    final text = Theme.of(context).textTheme;

    Widget section(
      String titleKey,
      SavedKind kind,
      List<SavedItem> items,
      String Function(SavedItem) route,
      int order,
    ) {
      if (items.isEmpty) return const SizedBox.shrink();
      return Reveal(
        order: order,
        child: Padding(
          padding: const EdgeInsets.only(bottom: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(tr(language, titleKey), style: text.titleLarge),
              const SizedBox(height: 8),
              for (final item in items)
                Dismissible(
                  key: ValueKey('${kind.name}-${item.id}'),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    color: Theme.of(
                      context,
                    ).colorScheme.error.withValues(alpha: 0.2),
                    child: MzIcon('close'),
                  ),
                  onDismissed: (_) =>
                      ref.read(savedProvider.notifier).toggle(kind, item),
                  child: Card(
                    child: ListTile(
                      title: Text(item.title),
                      subtitle: item.subtitle == null
                          ? null
                          : Text(item.subtitle!),
                      trailing: MzIcon('chevron-right'),
                      onTap: () => context.go(route(item)),
                    ),
                  ),
                ),
            ],
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(tr(language, 'saved'), style: text.headlineMedium),
        const SizedBox(height: 6),
        Text(tr(language, 'savedBody'), style: text.bodyMedium),
        const SizedBox(height: 18),
        if (saved.count == 0) Text(tr(language, 'savedEmpty')),
        section(
          'myPlaces',
          SavedKind.place,
          saved.places,
          (i) => '${AppRoutes.placeProfile}?featureId=${i.id}',
          0,
        ),
        section(
          'mySpots',
          SavedKind.spot,
          saved.spots,
          (i) =>
              '${AppRoutes.placeProfile}?lat=${i.latitude}&lng=${i.longitude}',
          1,
        ),
        section(
          'myLeaders',
          SavedKind.leader,
          saved.leaders,
          (i) => i.featureId == null
              ? AppRoutes.placeSearch
              : '${AppRoutes.placeProfile}?featureId=${i.featureId}',
          2,
        ),
        section(
          'myProjects',
          SavedKind.project,
          saved.projects,
          (_) => AppRoutes.placeSearch,
          3,
        ),
      ],
    );
  }
}
