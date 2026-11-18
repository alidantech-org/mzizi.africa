import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/home/place_switcher.dart';
import 'package:mzizi_app/presentation/home/standing.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// Two places side by side on the same figures. The left is "my place"; the right is chosen here.
class CompareScreen extends StatefulWidget {
  const CompareScreen({super.key});
  @override
  State<CompareScreen> createState() => _CompareScreenState();
}

class _CompareScreenState extends State<CompareScreen> {
  LocalityLocalityUnit? _other;
  static const _rows = <(String, String, String)>[
    ('sta.population.total', 'People', ''),
    ('sta.population.density', 'People per km²', ''),
    ('sta.area.km2', 'Area (km²)', ''),
  ];

  @override
  Widget build(BuildContext context) {
    final me = UserStore.instance;
    final text = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: Tx(t(context, 'Compare places'))),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Tx(tf(context, 'Compare {} with another place', [me.placeName ?? 'Kenya']), style: text.titleMedium),
          const SizedBox(height: 12),
          FilledButton.tonal(
            onPressed: () => showPlaceSwitcher(
              context,
              title: t(context, 'Compare with'),
              onPick: (p) => setState(() => _other = p),
            ),
            child: Tx(_other?.name ?? 'Choose a place'),
          ),
          const SizedBox(height: 16),
          if (me.placeId != null && _other != null)
            _Pair(a: me.placeId!, b: _other!.featureId, aName: me.placeName ?? '', bName: _other!.name),
        ],
      ),
    );
  }
}

class _Pair extends StatelessWidget {
  const _Pair({required this.a, required this.b, required this.aName, required this.bName});
  final String a, b, aName, bName;

  double? _value(InsightsPlaceStatistics d, String code) {
    for (final t in asMaps(d.topics)) {
      for (final i in asMaps(t['indicators'])) {
        if (i['code'] == code) return asNum(asMap(i['latest'])['value']);
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPlaceStatistics>(
    reloadKey: 'cmp|$a',
    load: (_) => InsightsFeature(MziziApi.connection).getPlaceStatistics(featureId: a),
    builder: (context, da) => AsyncPage<InsightsPlaceStatistics>(
      reloadKey: 'cmp|$b',
      load: (_) => InsightsFeature(MziziApi.connection).getPlaceStatistics(featureId: b),
      builder: (context, db) => Column(
        children: [
          for (final r in _CompareScreenState._rows)
            GlassCard(
              margin: const EdgeInsets.only(bottom: 10),
              child: Builder(
                builder: (_) {
                  final x = _value(da, r.$1), y = _value(db, r.$1);
                  final diff = x == null || y == null || y == 0 ? null : (x - y) / y * 100;
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Tx(r.$2, style: Theme.of(context).textTheme.titleSmall),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Expanded(child: Tx('$aName\n${compact(x)}')),
                          Expanded(child: Tx('$bName\n${compact(y)}')),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Tx(percentWords(context, diff, bName)),
                    ],
                  );
                },
              ),
            ),
        ],
      ),
    ),
  );
}
