import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// One citation with its source, locator, edition and files. Hand-built.
class EvidencePage extends ConsumerWidget {
  const EvidencePage({super.key, required this.citationId});

  final String citationId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final text = Theme.of(context).textTheme;
    return AsyncPage<LocalityEvidenceDetail>(
      reloadKey: citationId,
      load: (_) => LocalityFeature(
        MziziApi.connection,
      ).getEvidence(citationId: citationId),
      builder: (context, detail) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              onPressed: () =>
                  context.canPop() ? context.pop() : context.go('/'),
              icon: const Icon(Icons.arrow_back),
              label: Text(tr(language, 'evidence')),
            ),
          ),
          Text(
            detail.evidence.sourceName,
            style: text.headlineSmall?.copyWith(fontFamily: 'Georgia'),
          ),
          if (detail.evidence.publisherName != null)
            Text(detail.evidence.publisherName!),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(tr(language, 'locator'), style: text.labelMedium),
                  Text(detail.evidence.locator ?? tr(language, 'notRecorded')),
                  const SizedBox(height: 12),
                  Text(tr(language, 'edition'), style: text.labelMedium),
                  Text(detail.editionLabel ?? tr(language, 'notRecorded')),
                  const SizedBox(height: 12),
                  Text(
                    detail.evidence.artifactTitle ?? '',
                    style: text.bodySmall?.copyWith(fontFamily: 'monospace'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
