import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/explore/explore_catalog.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

/// The Explore tab: every field the app covers with what you will find there. Tap a card to open it.
class ExploreHub extends StatelessWidget {
  const ExploreHub({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    return SafeArea(
      bottom: false,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Tx(
                    'Explore',
                    style: text.headlineLarge?.copyWith(fontFamily: 'Georgia'),
                  ),
                  const SizedBox(height: 4),
                  Tx(
                    'Everything Mzizi covers, and what to find in each part.',
                    style: text.bodyMedium,
                  ),
                  const SizedBox(height: 14),
                  Material(
                    color: scheme.primary.withValues(alpha: 0.08),
                    shape: const StadiumBorder(),
                    child: InkWell(
                      customBorder: const StadiumBorder(),
                      onTap: () => context.push('/search'),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 14,
                        ),
                        child: Row(
                          children: [
                            MzIcon('search', size: 20),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Tx(
                                'Search places, leaders, parties and projects',
                                style: text.bodyMedium,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
            sliver: SliverList.separated(
              itemCount: exploreCatalog.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (context, i) {
                final e = exploreCatalog[i];
                return _ExploreCard(entry: e);
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ExploreCard extends StatelessWidget {
  const _ExploreCard({required this.entry});
  final ExploreEntry entry;
  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: Theme.of(context).brightness == Brightness.dark
          ? scheme.surfaceContainerHigh
          : scheme.surfaceContainerLowest,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: scheme.outlineVariant.withValues(alpha: 0.5)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: () {
          HapticFeedback.selectionClick();
          context.push(entry.path);
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  gradient: LinearGradient(
                    colors: [
                      scheme.primary.withValues(alpha: 0.25),
                      scheme.tertiary.withValues(alpha: 0.18),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: MzIcon(entry.icon, size: 26, color: scheme.primary),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Tx(entry.title, style: text.titleMedium),
                    const SizedBox(height: 2),
                    Tx(entry.body, style: text.bodySmall),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: [
                        for (final f in entry.finds)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 9,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(99),
                              color: scheme.primary.withValues(alpha: 0.1),
                            ),
                            child: Tx(f, style: text.labelSmall),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 4),
              Padding(
                padding: const EdgeInsets.only(top: 14),
                child: MzIcon('chevron-right', size: 18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
