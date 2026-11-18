import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/home/standing.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// The Rankings tab: one top tab per category of figure; each shows where your place stands and the top places.
class RankingsTab extends StatelessWidget {
  const RankingsTab({super.key, this.metric});
  final String? metric;

  @override
  Widget build(BuildContext context) => AsyncPage<InsightsLeaderboardMetricList>(
    reloadKey: 'rank-metrics',
    load: (_) => InsightsFeature(MziziApi.connection).listLeaderboardMetrics(),
    builder: (context, list) {
      final metrics = list.metrics.where((m) => m.domain != 'activity').toList();
      final found = metrics.indexWhere((m) => m.code == metric);
      final start = found < 0 ? 0 : found;
      return DefaultTabController(
        length: metrics.length,
        initialIndex: start,
        child: Column(
          children: [
            TabBar(
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              tabs: [for (final m in metrics) Tab(text: m.title)],
            ),
            Expanded(
              child: TabBarView(
                children: [for (final m in metrics) _MetricBoard(metric: m)],
              ),
            ),
          ],
        ),
      );
    },
  );
}

class _MetricBoard extends StatelessWidget {
  const _MetricBoard({required this.metric});
  final InsightsLeaderboardMetric metric;

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: UserStore.instance,
    builder: (context, _) {
      final me = UserStore.instance;
      final kind = boardKind(me.placeKind);
      return AsyncPage<InsightsLeaderboard>(
        reloadKey: 'rank|${metric.code}|$kind',
        load: (_) => InsightsFeature(MziziApi.connection).getLeaderboard(metricCode: metric.code, kindCode: kind, limit: 500),
        builder: (context, board) {
          final s = Standing.from(board, me.placeId);
          final top = board.rows.take(10).toList();
          final text = Theme.of(context).textTheme;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(metric.describe, style: text.bodySmall),
              const SizedBox(height: 10),
              if (me.placeId != null && s.mine != null) StandingCard(standing: s),
              Text('Top ${top.length}', style: text.titleMedium),
              const SizedBox(height: 6),
              for (final r in top)
                GlassCard(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  onTap: r.featureId == null ? null : () => context.push('/civic/${r.featureId}'),
                  child: Row(
                    children: [
                      SizedBox(width: 28, child: Text('${r.rank}', style: const TextStyle(fontWeight: FontWeight.w700))),
                      Expanded(child: Text(r.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: r.featureId == me.placeId ? FontWeight.w800 : null))),
                      Text('${compact(r.value)} ${metric.unit ?? ''}', style: const TextStyle(fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              GapsNote(items: board.gaps, topic: metric.title),
            ],
          );
        },
      );
    },
  );
}
