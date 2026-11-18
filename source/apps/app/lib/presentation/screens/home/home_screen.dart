import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/brand/mz_logo.dart';
import 'package:mzizi_app/presentation/widgets/petal_burst.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/home/place_switcher.dart';
import 'package:mzizi_app/presentation/home/standing.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// Home: the logo and the place switcher in its own bar, then the numbers for "my place" compared with the rest of
/// Kenya, a fact and where to go next. The bar slides away on scroll and returns on the way back up.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tick = 0;
  bool _burst = false;
  final _above = <String, bool>{};

  /// Called as each comparison loads: when the place is at or above the average on most main measures, rain petals once.
  void _standingLoaded(Standing s) {
    _above[s.metric.code] = s.mine != null && s.better;
    if (_above.length >= 3 &&
        !PetalBurst.playedThisSession &&
        _above.values.where((v) => v).length >= 2 &&
        mounted) {
      PetalBurst.playedThisSession = true;
      setState(() => _burst = true);
    }
  }

  Future<void> _refresh() async {
    HapticFeedback.lightImpact();
    setState(() => _tick++);
    await Future<void>.delayed(const Duration(milliseconds: 700));
  }

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: UserStore.instance,
    builder: (context, _) {
      final me = UserStore.instance;
      final text = Theme.of(context).textTheme;
      final kind = me.boardKindCode;
      final here = me.placeId;
      return RefreshIndicator(
        onRefresh: _refresh,
        edgeOffset: 80,
        child: Stack(
          children: [
            CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverAppBar(
                  floating: true,
                  snap: true,
                  titleSpacing: 16,
                  toolbarHeight: 60,
                  title: const MzLogo(size: 30),
                  actions: [
                    ConstrainedBox(
                      constraints: BoxConstraints(
                        maxWidth: MediaQuery.sizeOf(context).width * 0.7,
                      ),
                      child: _PlaceChip(name: me.placeName),
                    ),
                    const SizedBox(width: 16),
                  ],
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
                  sliver: SliverList.list(
                    children: [
                      const DevelopmentNotice(compact: true),
                      if (here != null) ...[
                        _PlaceFigures(
                          key: ValueKey('f$here$_tick'),
                          featureId: here,
                          name: me.placeName ?? '',
                        ),
                        const SizedBox(height: 18),
                        Tx(
                          tf(context, 'How {} compares', [me.placeName]),
                          style: text.titleMedium,
                        ),
                        Tx(
                          'Compared with places at the same ranking level.',
                          style: text.bodySmall,
                        ),
                        if (me.boardId != null && me.boardId != here)
                          Tx(
                            tf(context, 'Ranked as part of {}', [me.boardName]),
                            style: text.bodySmall,
                          ),
                        const SizedBox(height: 8),
                        for (final m in const [
                          'sta.population.density',
                          'civ.projects.per-100k',
                          'fin.ngcdf.per-capita',
                        ])
                          StandingLoader(
                            key: ValueKey('$m$_tick${me.boardId}'),
                            metric: m,
                            kind: kind,
                            featureId: me.boardId ?? here,
                            onLoaded: _standingLoaded,
                            onTap: () => context.go('/rankings?metric=$m'),
                          ),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: MzIcon('chart', size: 18),
                                label: Tx('Compare places'),
                                onPressed: () => context.push('/compare'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: MzIcon('tree', size: 18),
                                label: Tx('Your leaders'),
                                onPressed: () => context.push('/leaders-tree'),
                              ),
                            ),
                          ],
                        ),
                      ] else
                        _Nationwide(),
                      const SizedBox(height: 18),
                      _DidYouKnow(
                        key: ValueKey('d$here$_tick'),
                        featureId: here,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (_burst)
              Positioned.fill(
                child: PetalBurst(onDone: () => setState(() => _burst = false)),
              ),
          ],
        ),
      );
    },
  );
}

/// The place name as a pill that opens the picker: tap to switch.
class _PlaceChip extends StatelessWidget {
  const _PlaceChip({required this.name});
  final String? name;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: scheme.primary.withValues(alpha: 0.12),
      shape: const StadiumBorder(),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: () {
          HapticFeedback.selectionClick();
          showPlaceSwitcher(context);
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              MzIcon('pin', size: 16, color: scheme.primary),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  name ?? t(context, 'Choose your place'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: scheme.primary,
                  ),
                ),
              ),
              const SizedBox(width: 4),
              MzIcon('chevron-down', size: 16, color: scheme.primary),
            ],
          ),
        ),
      ),
    );
  }
}

class _PlaceFigures extends StatelessWidget {
  const _PlaceFigures({super.key, required this.featureId, required this.name});
  final String featureId;
  final String name;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPlaceStatistics>(
    reloadKey: 'home|$featureId',
    load: (_) => InsightsFeature(
      MziziApi.connection,
    ).getPlaceStatistics(featureId: featureId),
    builder: (context, d) {
      final all = [
        for (final t in asMaps(d.topics)) ...asMaps(t['indicators']),
      ];
      Map<String, dynamic>? one(String code) {
        for (final i in all) {
          if (i['code'] == code) return i;
        }
        return null;
      }

      double? v(String code) => asNum(asMap(one(code)?['latest'])['value']);
      final series = asMaps(one('sta.population.total')?['series']);
      final pos = asMap(asMap(d.siblings)['population']);
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TileGrid(
            children: [
              StatTile(
                label: 'People',
                value: v('sta.population.total') == null
                    ? '—'
                    : compact(v('sta.population.total')),
                info:
                    'People counted by the national census, or estimated between censuses.',
              ),
              StatTile(
                label: 'People per km²',
                value: v('sta.population.density') == null
                    ? '—'
                    : compact(v('sta.population.density')),
                info:
                    'How many people live in each square kilometre. Higher means more crowded.',
              ),
              StatTile(
                label: 'Area',
                value: v('sta.area.km2') == null
                    ? '—'
                    : '${compact(v('sta.area.km2'))} km²',
                info:
                    'Land and inland water inside the boundary, in square kilometres.',
              ),
              StatTile(
                label: 'Size rank',
                value: pos['position'] == null ? '—' : '#${pos['position']}',
                hint: pos['of'] == null
                    ? null
                    : tf(context, 'of {} alike', [pos['of']]),
                info:
                    'Where this place stands by population among places of the same kind.',
              ),
            ],
          ),
          if (series.length > 1) ...[
            const SizedBox(height: 14),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Tx(
                  'Population over time',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: 8),
                SeriesChart(
                  height: 120,
                  values: [for (final p in series) asNum(p['value']) ?? 0],
                  labels: [
                    for (final p in series)
                      asText(p['period']).padRight(4).substring(0, 4),
                  ],
                ),
              ],
            ),
          ],
        ],
      );
    },
  );
}

class _Nationwide extends StatelessWidget {
  @override
  Widget build(BuildContext context) => GlassCard(
    onTap: () => showPlaceSwitcher(context),
    child: Tx(
      t(
        context,
        'Choose your place to see how it compares with the rest of Kenya.',
      ),
    ),
  );
}

class _DidYouKnow extends StatelessWidget {
  const _DidYouKnow({super.key, this.featureId});
  final String? featureId;
  @override
  Widget build(BuildContext context) => AsyncPage<ExperienceFactList>(
    reloadKey: 'fact|$featureId',
    load: (_) => ExperienceFeature(
      MziziApi.connection,
    ).listFacts(input: ExperienceFactsInput(featureId: featureId, limit: 1)),
    builder: (context, d) {
      final facts = d.facts;
      if (facts.isEmpty) return const SizedBox.shrink();
      final f = facts.first;
      return GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                MzIcon('sparkle', size: 18),
                const SizedBox(width: 6),
                Tx(
                  'Did you know?',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
              ],
            ),
            const SizedBox(height: 6),
            Tx(f.statement),
            if ((f.detail ?? '').isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Tx(
                  f.detail!,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
          ],
        ),
      );
    },
  );
}
