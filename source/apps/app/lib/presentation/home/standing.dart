import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// "Which board does this place sit on": the leaderboard kind for a place kind.
String boardKind(String? placeKind) {
  final kind = (placeKind ?? '').toLowerCase();
  if (kind.endsWith('county')) return 'county';
  return 'constituency';
}

/// Where one place stands on one metric: its value and rank, the average and the best value among its peers.
class Standing {
  const Standing({
    required this.metric,
    required this.mine,
    required this.rank,
    required this.of,
    required this.average,
    required this.top,
    required this.topName,
    required this.scope,
  });
  final InsightsLeaderboardMetric metric;
  final double? mine;
  final int? rank;
  final int of;
  final double average;
  final double top;
  final String topName;
  final String scope;

  /// Percent difference from the average, positive when above it.
  double? get vsAverage =>
      mine == null || average == 0 ? null : (mine! - average) / average * 100;
  double? get vsTop =>
      mine == null || top == 0 ? null : (mine! - top) / top * 100;
  bool get better =>
      metric.higherIsBetter ? (vsAverage ?? 0) >= 0 : (vsAverage ?? 0) <= 0;

  static Standing from(InsightsLeaderboard board, String? featureId) {
    final rows = board.rows;
    final mineRow = rows.where((r) => r.featureId == featureId).firstOrNull;
    final avg = rows.isEmpty
        ? 0.0
        : rows.map((r) => r.value).reduce((a, b) => a + b) / rows.length;
    final best = rows.isEmpty ? null : rows.first;
    return Standing(
      metric: board.metric,
      mine: mineRow?.value,
      rank: mineRow?.rank,
      of: rows.length,
      average: avg,
      top: best?.value ?? 0,
      topName: best?.name ?? '',
      scope: board.scope,
    );
  }
}

String percentWords(BuildContext context, double? pct, String versus) {
  if (pct == null) return t(context, 'Not enough data to compare');
  final abs = pct.abs();
  if (abs < 1) return tf(context, 'About the same as {}', [versus]);
  final text = '${abs.toStringAsFixed(abs < 10 ? 1 : 0)}%';
  return tf(context, pct > 0 ? '{} above {}' : '{} below {}', [text, versus]);
}

/// A card that says where "yours" stands, in plain words, with a bar against the best.
class StandingCard extends StatelessWidget {
  const StandingCard({
    super.key,
    required this.standing,
    this.onTap,
    this.place,
  });
  final Standing standing;
  final VoidCallback? onTap;
  final String? place;

  @override
  Widget build(BuildContext context) {
    final s = standing;
    final text = Theme.of(context).textTheme;
    final unit = s.metric.unit ?? '';
    final tone = s.mine == null
        ? MziziTokens.inkSoft
        : s.better
        ? MziziTokens.raffia
        : MziziTokens.danger;
    final share = s.top == 0 || s.mine == null
        ? 0.0
        : (s.mine! / s.top).clamp(0.0, 1.0);
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: Theme.of(context).dividerColor.withValues(alpha: 0.6),
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(s.metric.title, style: text.titleSmall),
            const SizedBox(height: 6),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  s.mine == null ? '—' : compact(s.mine),
                  style: text.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(width: 6),
                Text(unit, style: text.bodySmall),
                const Spacer(),
                if (s.rank != null)
                  Pill(tf(context, '#{} of {}', [s.rank, s.of])),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: share,
                minHeight: 8,
                color: tone,
                backgroundColor: tone.withValues(alpha: 0.15),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              percentWords(context, s.vsAverage, t(context, 'the average')),
              style: text.bodyMedium?.copyWith(
                color: tone,
                fontWeight: FontWeight.w600,
              ),
            ),
            if (s.vsTop != null && s.rank != 1)
              Text(
                '${percentWords(context, s.vsTop, tf(context, 'the top, {}', [s.topName]))} (${compact(s.top)} $unit)',
                style: text.bodySmall,
              ),
          ],
        ),
      ),
    );
  }
}

/// Loads the board for [metric] and shows [StandingCard] for [featureId].
class StandingLoader extends StatelessWidget {
  const StandingLoader({
    super.key,
    required this.metric,
    required this.kind,
    required this.featureId,
    this.onTap,
    this.onLoaded,
  });
  final void Function(Standing standing)? onLoaded;
  final String metric;
  final String kind;
  final String? featureId;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => AsyncPage<InsightsLeaderboard>(
    reloadKey: 'standing|$metric|$kind',
    load: (_) => InsightsFeature(
      MziziApi.connection,
    ).getLeaderboard(metricCode: metric, kindCode: kind, limit: 500),
    builder: (context, board) {
      final standing = Standing.from(board, featureId);
      if (onLoaded != null) {
        WidgetsBinding.instance.addPostFrameCallback(
          (_) => onLoaded!(standing),
        );
      }
      return StandingCard(standing: standing, onTap: onTap);
    },
  );
}
