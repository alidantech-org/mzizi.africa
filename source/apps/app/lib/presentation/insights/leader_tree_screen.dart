import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// Leaders as a family tree: the nation at the top, then county, constituency and ward, each split by how the
/// leader got the seat (elected, appointed, nominated).
class LeaderTreeScreen extends StatelessWidget {
  const LeaderTreeScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Tx(t(context, 'Your leaders'))),
    body: AsyncPage<InsightsLeaderTree>(
      reloadKey: 'tree|${UserStore.instance.placeId}',
      load: (_) => InsightsFeature(MziziApi.connection).getLeaderTree(input: InsightsTreeInput(featureId: UserStore.instance.placeId)),
      builder: (context, d) {
        final text = Theme.of(context).textTheme;
        final levels = asMaps(d.levels);
        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            for (var i = 0; i < levels.length; i++)
              Padding(
                padding: EdgeInsets.only(left: i * 10.0, bottom: 12),
                child: GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Tx(asText(levels[i]['label']), style: text.titleMedium),
                      Tx(tf(context, '{} leaders', [levels[i]['total']]), style: text.bodySmall),
                      for (final how in const ['elected', 'appointed', 'nominated'])
                        ..._group(context, how, asMaps(asMap(levels[i]['groups'])[how])),
                    ],
                  ),
                ),
              ),
            GapsNote(items: d.gaps, topic: 'leaders'),
          ],
        );
      },
    ),
  );

  List<Widget> _group(BuildContext context, String how, List<Map<String, dynamic>> people) {
    if (people.isEmpty) return const [];
    return [
      const SizedBox(height: 10),
      Pill(t(context, how[0].toUpperCase() + how.substring(1))),
      for (final p in people.take(5))
        ListTile(
          dense: true,
          contentPadding: EdgeInsets.zero,
          title: Tx(asText(p['name'])),
          subtitle: Tx([asText(p['office']), asText(p['party'])].where((e) => e.isNotEmpty).join(' · ')),
          onTap: () => context.push('/leader/${p['holderId']}'),
        ),
      if (people.length > 5) Tx(tf(context, 'and {} more', [people.length - 5]), style: Theme.of(context).textTheme.bodySmall),
    ];
  }
}
