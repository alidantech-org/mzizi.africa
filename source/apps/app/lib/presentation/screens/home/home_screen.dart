import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/home/place_switcher.dart';
import 'package:mzizi_app/presentation/home/standing.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// Home: the numbers for "my place" first, compared with the rest of Kenya, then a fact and where to go next.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: UserStore.instance,
    builder: (context, _) {
      final me = UserStore.instance;
      final text = Theme.of(context).textTheme;
      final kind = me.boardKindCode;
      return ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Tx(me.placeId == null ? 'Kenya' : 'Your place', style: text.labelMedium),
                    Tx(me.placeName ?? 'All of Kenya', style: text.headlineMedium),
                  ],
                ),
              ),
              OutlinedButton.icon(
                icon: MzIcon('pin', size: 18),
                label: Tx(me.placeId == null ? 'Set place' : 'Switch'),
                onPressed: () => showPlaceSwitcher(context),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (me.placeId != null) ...[
            _PlaceFigures(featureId: me.placeId!),
            const SizedBox(height: 8),
            Tx(tf(context, 'How {} compares', [me.placeName]), style: text.titleMedium),
            Tx(
              kind == 'county' ? 'Against every county in Kenya.' : 'Against every constituency in Kenya.',
              style: text.bodySmall,
            ),
            if (me.boardId != null && me.boardId != me.placeId)
              Tx(tf(context, 'Ranked as part of {}', [me.boardName]), style: text.bodySmall),
            const SizedBox(height: 8),
            for (final m in const [
              'sta.population.density',
              'civ.projects.per-100k',
              'fin.ngcdf.per-capita',
            ])
              StandingLoader(
                metric: m,
                kind: kind,
                featureId: me.boardId ?? me.placeId,
                onTap: () => context.go('/rankings?metric=$m'),
              ),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: MzIcon('chart', size: 18),
                    label: Tx(t(context, 'Compare places')),
                    onPressed: () => context.push('/compare'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: MzIcon('tree', size: 18),
                    label: Tx(t(context, 'Your leaders')),
                    onPressed: () => context.push('/leaders-tree'),
                  ),
                ),
              ],
            ),
          ] else
            _Nationwide(),
          const SizedBox(height: 18),
          _DidYouKnow(featureId: me.placeId),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final c in const [
                ('Elections', '/elections', 'vote'),
                ('Parliament', '/parliament', 'parliament'),
                ('Projects', '/civic', 'build'),
                ('Tenders', '/tenders', 'document'),
              ])
                ActionChip(
                  avatar: MzIcon(c.$3, size: 16),
                  label: Tx(c.$1),
                  onPressed: () => context.go(c.$2),
                ),
            ],
          ),
        ],
      );
    },
  );
}

class _PlaceFigures extends StatelessWidget {
  const _PlaceFigures({required this.featureId});
  final String featureId;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPlaceStatistics>(
    reloadKey: 'home|$featureId',
    load: (_) => InsightsFeature(MziziApi.connection).getPlaceStatistics(featureId: featureId),
    builder: (context, d) {
      final all = [for (final t in asMaps(d.topics)) ...asMaps(t['indicators'])];
      double? v(String code) {
        for (final i in all) {
          if (i['code'] == code) return asNum(asMap(i['latest'])['value']);
        }
        return null;
      }
      final pos = asMap(asMap(d.siblings)['population']);
      return TileGrid(
        children: [
          StatTile(label: t(context, 'People'), value: compact(v('sta.population.total'))),
          StatTile(label: t(context, 'People per km²'), value: compact(v('sta.population.density'))),
          StatTile(label: t(context, 'Area'), value: '${compact(v('sta.area.km2'))} km²'),
          StatTile(label: t(context, 'Size rank'), value: '#${pos['position'] ?? '—'}', hint: 'of ${pos['of'] ?? '—'} alike'),
        ],
      );
    },
  );
}

class _Nationwide extends StatelessWidget {
  @override
  Widget build(BuildContext context) => GlassCard(
    onTap: () => showPlaceSwitcher(context),
    child: Tx(t(context, 'Choose your place to see how it compares with the rest of Kenya.')),
  );
}

class _DidYouKnow extends StatelessWidget {
  const _DidYouKnow({this.featureId});
  final String? featureId;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsFactList>(
    reloadKey: 'fact|$featureId',
    load: (_) => InsightsFeature(MziziApi.connection).listFacts(input: InsightsFactsInput(featureId: featureId, limit: 1)),
    builder: (context, d) {
      final facts = asMaps(d.facts);
      if (facts.isEmpty) return const SizedBox.shrink();
      final f = facts.first;
      return GlassCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [MzIcon('sparkle', size: 18), const SizedBox(width: 6), Tx('Did you know?', style: Theme.of(context).textTheme.titleSmall)]),
            const SizedBox(height: 6),
            Tx(asText(f['statement'])),
            if (asText(f['detail']).isNotEmpty) Padding(padding: const EdgeInsets.only(top: 4), child: Tx(asText(f['detail']), style: Theme.of(context).textTheme.bodySmall)),
          ],
        ),
      );
    },
  );
}
