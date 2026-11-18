import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/home/standing.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// The Rankings tab: one top tab per category of figure; each shows where your place stands and the top places.
class RankingsTab extends StatelessWidget {
  const RankingsTab({super.key, this.metric});
  final String? metric;

  @override
  Widget build(BuildContext context) =>
      AsyncPage<InsightsLeaderboardMetricList>(
        reloadKey: 'rank-metrics',
        load: (_) =>
            InsightsFeature(MziziApi.connection).listLeaderboardMetrics(),
        builder: (context, list) {
          final metrics = list.metrics
              .where((m) => m.domain != 'activity')
              .toList();
          if (metrics.isEmpty) {
            return const EmptyState(
              icon: 'chart',
              title: 'No ranking measures are available yet.',
            );
          }
          return _AvailableRankings(metrics: metrics, requested: metric);
        },
      );
}

class _RankingSelection {
  const _RankingSelection(this.index, this.board);
  final int index;
  final ApiResult<InsightsLeaderboard>? board;
}

class _AvailableRankings extends StatefulWidget {
  const _AvailableRankings({required this.metrics, this.requested});
  final List<InsightsLeaderboardMetric> metrics;
  final String? requested;
  @override
  State<_AvailableRankings> createState() => _AvailableRankingsState();
}

class _AvailableRankingsState extends State<_AvailableRankings> {
  late Future<_RankingSelection> _selection = _findFirst();
  @override
  void didUpdateWidget(_AvailableRankings old) {
    super.didUpdateWidget(old);
    if (old.requested != widget.requested || old.metrics != widget.metrics) {
      _selection = _findFirst();
    }
  }

  Future<_RankingSelection> _findFirst() async {
    final requested = widget.metrics.indexWhere(
      (m) => m.code == widget.requested,
    );
    if (requested >= 0) return _RankingSelection(requested, null);
    for (var i = 0; i < widget.metrics.length; i++) {
      final result = await InsightsFeature(MziziApi.connection).getLeaderboard(
        metricCode: widget.metrics[i].code,
        kindCode: UserStore.instance.boardKindCode,
        limit: 500,
      );
      final board = result.dataOrNull;
      if (board != null && board.rows.isNotEmpty) {
        return _RankingSelection(i, result);
      }
    }
    return const _RankingSelection(0, null);
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<_RankingSelection>(
    future: _selection,
    builder: (context, snapshot) {
      if (!snapshot.hasData) return const LoadingView();
      final metrics = widget.metrics;
      final start = snapshot.data!.index;
      return DefaultTabController(
        length: metrics.length,
        initialIndex: start,
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 4),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Tx(
                        'Rankings',
                        style: Theme.of(context).textTheme.headlineLarge
                            ?.copyWith(fontFamily: 'Georgia'),
                      ),
                      Tx(
                        'Who comes top, and where you stand.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const DevelopmentNotice(compact: true),
                    ],
                  ),
                ),
              ),
              TabBar(
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                tabs: [for (final m in metrics) Tab(text: m.title)],
              ),
              Expanded(
                child: TabBarView(
                  children: [
                    for (var i = 0; i < metrics.length; i++)
                      _MetricBoard(
                        metric: metrics[i],
                        initial: i == start ? snapshot.data!.board : null,
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}

class _MetricBoard extends StatelessWidget {
  const _MetricBoard({required this.metric, this.initial});
  final InsightsLeaderboardMetric metric;
  final ApiResult<InsightsLeaderboard>? initial;

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: UserStore.instance,
    builder: (context, _) {
      final me = UserStore.instance;
      final kind = me.boardKindCode;
      var useInitial = initial != null;
      return AsyncPage<InsightsLeaderboard>(
        reloadKey: 'rank|${metric.code}|$kind',
        load: (_) async {
          if (useInitial) {
            useInitial = false;
            return initial!;
          }
          return InsightsFeature(
            MziziApi.connection,
          ).getLeaderboard(metricCode: metric.code, kindCode: kind, limit: 500);
        },
        builder: (context, board) {
          if (board.rows.isEmpty) {
            return ListView(
              children: [
                EmptyState(
                  icon: 'chart',
                  title: t(
                    context,
                    'No ranking is recorded for this measure yet.',
                  ),
                  body: metric.describe,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GapsNote(items: board.gaps, topic: metric.title),
                ),
              ],
            );
          }
          final s = Standing.from(board, me.boardId ?? me.placeId);
          final top = board.rows.take(10).toList();
          final text = Theme.of(context).textTheme;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Tx(metric.describe, style: text.bodySmall),
              const SizedBox(height: 10),
              if (me.placeId != null && s.mine != null)
                StandingCard(standing: s),
              Tx(tf(context, 'Top {}', [top.length]), style: text.titleMedium),
              const SizedBox(height: 6),
              for (final r in top)
                Builder(
                  builder: (context) {
                    final mine = r.featureId == (me.boardId ?? me.placeId);
                    final share = s.top == 0
                        ? 0.0
                        : (r.value / s.top).clamp(0.0, 1.0);
                    final colour = mine
                        ? Theme.of(context).colorScheme.primary
                        : Theme.of(context).colorScheme.tertiary;
                    return InkWell(
                      onTap: r.featureId == null
                          ? null
                          : () => context.push('/civic/${r.featureId}'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: Theme.of(
                                context,
                              ).dividerColor.withValues(alpha: 0.6),
                            ),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 26,
                                  height: 26,
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: colour.withValues(
                                      alpha: r.rank <= 3 ? 0.9 : 0.15,
                                    ),
                                  ),
                                  child: Text(
                                    '${r.rank}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w800,
                                      fontSize: 12,
                                      color: r.rank <= 3
                                          ? Colors.white
                                          : colour,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    r.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontWeight: mine
                                          ? FontWeight.w800
                                          : FontWeight.w600,
                                    ),
                                  ),
                                ),
                                Text(
                                  '${compact(r.value)} ${metric.unit ?? ''}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: LinearProgressIndicator(
                                value: share,
                                minHeight: 6,
                                color: colour,
                                backgroundColor: colour.withValues(alpha: 0.12),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              GapsNote(items: board.gaps, topic: metric.title),
            ],
          );
        },
      );
    },
  );
}
