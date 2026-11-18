// Dismiss the detail sheet before navigating, keeping route pushes separate from modal pop transitions.
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/media_gallery.dart';

Future<void> showGovernanceNode(
  BuildContext context,
  GovernanceNode node,
) async {
  ModalRoute<String>? sheetRoute;
  final destination = await showModalBottomSheet<String>(
    context: context,
    showDragHandle: true,
    isScrollControlled: true,
    builder: (sheetContext) {
      sheetRoute = ModalRoute.of<String>(sheetContext);
      return SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (node.photo.isNotEmpty)
                Portrait(name: node.name, url: node.photo, size: 72),
              const SizedBox(height: 12),
              Text(
                node.name,
                style: Theme.of(sheetContext).textTheme.headlineSmall,
              ),
              if (node.title.isNotEmpty)
                Text(
                  node.title,
                  style: Theme.of(sheetContext).textTheme.titleMedium,
                ),
              const SizedBox(height: 8),
              Text(
                [
                  node.how,
                  node.body,
                  node.purpose,
                ].where((e) => e.isNotEmpty).join('\n'),
              ),
              const SizedBox(height: 16),
              if (node.performance == null && node.holderId.isNotEmpty)
                const Tx(
                  'No performance measure is recorded. This is not a zero score.',
                ),
              if (node.performance != null)
                Text(
                  '${node.performance!.label}: ${compact(node.performance!.value)}%',
                ),
              const SizedBox(height: 16),
              if (node.holderId.isNotEmpty)
                FilledButton(
                  onPressed: () => Navigator.pop(
                    sheetContext,
                    '/leader/${Uri.encodeComponent(node.holderId)}',
                  ),
                  child: const Tx('View leader'),
                ),
              if (node.code.isNotEmpty)
                FilledButton(
                  onPressed: () => Navigator.pop(
                    sheetContext,
                    '/institutions/${Uri.encodeComponent(node.code)}',
                  ),
                  child: const Tx('View institution'),
                ),
              const SizedBox(height: 16),
              Tx(
                'Reference records',
                style: Theme.of(sheetContext).textTheme.titleSmall,
              ),
              for (final reference in node.references)
                SelectableText(
                  reference,
                  style: Theme.of(sheetContext).textTheme.bodySmall,
                ),
              if (node.holderId.isNotEmpty) const DevelopmentNotice(),
            ],
          ),
        ),
      );
    },
  );
  // The returned pop result precedes the reverse transition; wait until the sheet releases its route.
  await sheetRoute?.completed;
  if (context.mounted && destination != null) context.push(destination);
}
