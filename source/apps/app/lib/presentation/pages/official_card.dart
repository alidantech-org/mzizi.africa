import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';
import 'package:mzizi_app/presentation/widgets/keep_buttons.dart';

String _initials(String name) => name
    .split(' ')
    .where((part) => part.isNotEmpty)
    .take(2)
    .map((part) => part[0].toUpperCase())
    .join();

/// One office holder: avatar, office, name, party, start date and a link to the evidence.
class OfficialCard extends StatelessWidget {
  const OfficialCard({super.key, required this.holder, required this.language});

  final LocalityOfficeHolder holder;
  final String language;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final evidence = holder.evidence.isEmpty ? null : holder.evidence.first;
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: MziziTokens.indigo,
              child: Text(
                _initials(holder.personName),
                style: const TextStyle(color: MziziTokens.cream, fontSize: 18),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    holder.officeTitle.toUpperCase(),
                    style: text.labelSmall?.copyWith(
                      color: MziziTokens.clay,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    holder.personName,
                    style: text.titleLarge?.copyWith(fontFamily: 'Georgia'),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${tr(language, 'party')}: ${holder.partyName ?? tr(language, 'notRecorded')}',
                    style: text.bodySmall,
                  ),
                  if (holder.tookOfficeOn != null)
                    Text(
                      '${tr(language, 'inOffice')} ${holder.tookOfficeOn!.toIso8601String().substring(0, 10)}',
                      style: text.bodySmall,
                    ),
                  Row(
                    children: [
                      HeartButton(
                        kind: SavedKind.leader,
                        tooltip: tr(language, 'likeLeader'),
                        item: SavedItem(
                          id: holder.holderId,
                          title: holder.personName,
                          subtitle: holder.officeTitle,
                          featureId: holder.unitFeatureId,
                        ),
                      ),
                      if (evidence != null)
                        TextButton(
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(0, 36),
                          ),
                          onPressed: () => context.push(
                            '${AppRoutes.evidenceView}?citationId=${evidence.citationId}',
                          ),
                          child: Text('${tr(language, 'seeEvidence')} ›'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
