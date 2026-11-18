// Nearby and top-performing comparison choices, with a backend-defined hierarchy and measures.
import 'dart:math' as math;
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/governance/parse/comparisons.dart';
import 'package:mzizi_app/presentation/home/place_picker.dart';
import 'package:mzizi_app/presentation/home/place_switcher.dart';
import 'package:mzizi_app/presentation/home/comparison_delta.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:mzizi_app/presentation/widgets/charts.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';

class CompareScreen extends StatefulWidget {
  const CompareScreen({super.key});
  @override
  State<CompareScreen> createState() => _CompareScreenState();
}

class _CompareScreenState extends State<CompareScreen> {
  ComparisonPlace? _base, _other;
  String? _metric;
  @override
  Widget build(BuildContext context) {
    final id = _base?.id ?? UserStore.instance.placeId;
    return Scaffold(
      appBar: AppBar(title: const Tx('Compare places')),
      body: id == null
          ? ListView(
              padding: const EdgeInsets.all(20),
              children: [
                const EmptyState(
                  icon: 'pin',
                  title: 'Choose a place to start comparing.',
                ),
                FilledButton(
                  onPressed: () => _pick(context, true),
                  child: const Tx('Choose your place'),
                ),
              ],
            )
          : AsyncPage<InsightsCompareOptions>(
              reloadKey: 'compare-options|$id|$_metric',
              load: (_) =>
                  InsightsFeature(MziziApi.connection).getCompareOptions(
                    input: InsightsCompareOptionsInput(
                      featureId: id,
                      metric: _metric,
                    ),
                  ),
              builder: (context, raw) {
                final d = ComparisonOptions(raw);
                return ListView(
                  padding: const EdgeInsets.all(20),
                  children: [
                    Tx(
                      'Start with your place',
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      d.place.name,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 10),
                    OutlinedButton.icon(
                      onPressed: () => _pick(context, true),
                      icon: const Icon(Icons.location_on_outlined),
                      label: const Tx('Change starting place'),
                    ),
                    const SizedBox(height: 18),
                    Tx(
                      'Compare at another level',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 6),
                    for (final level in d.levels) ...[
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                        leading: Icon(
                          level.available
                              ? Icons.layers_outlined
                              : Icons.layers_clear_outlined,
                        ),
                        title: Text(level.label),
                        subtitle: Text(level.unit?.name ?? level.message),
                        trailing: level.available
                            ? const Icon(Icons.chevron_right)
                            : null,
                        onTap: !level.available || level.unit == null
                            ? null
                            : () => setState(() {
                                _base = level.unit;
                                _other = null;
                              }),
                      ),
                      const Divider(height: 1),
                    ],
                    const SizedBox(height: 22),
                    if (d.metrics.isNotEmpty)
                      DropdownButtonFormField<String>(
                        initialValue:
                            _metric != null &&
                                d.metrics.any((m) => m.code == _metric)
                            ? _metric
                            : null,
                        isExpanded: true,
                        decoration: InputDecoration(
                          labelText: t(context, 'Ranking measure'),
                        ),
                        items: [
                          for (final metric in d.metrics)
                            DropdownMenuItem(
                              value: metric.code,
                              child: Text(
                                metric.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                        ],
                        onChanged: (value) => setState(() => _metric = value),
                      ),
                    const SizedBox(height: 20),
                    FilledButton.tonalIcon(
                      onPressed: () => _pick(context, false),
                      icon: const Icon(Icons.compare_arrows),
                      label: Text(
                        _other?.name ?? t(context, 'Choose another place'),
                      ),
                    ),
                    if (_other != null) _ComparisonPair(a: id, b: _other!.id),
                    const SizedBox(height: 20),
                    Tx(
                      'Closest places',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 6),
                    if (d.nearby.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Tx(
                          'Nearby places are not available at this level.',
                        ),
                      ),
                    for (final place in d.nearby)
                      _choice(context, place, false),
                    const SizedBox(height: 22),
                    Tx(
                      'Top performers',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 6),
                    if (d.top.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Tx(
                          'No ranking is recorded for this measure yet.',
                        ),
                      ),
                    for (final place in d.top) _choice(context, place, true),
                    GapsNote(items: d.gaps, topic: 'comparison'),
                  ],
                );
              },
            ),
    );
  }

  Widget _choice(BuildContext context, ComparisonPlace place, bool ranked) =>
      Column(
        children: [
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text(place.name),
            subtitle: Text(
              place.distance != null
                  ? '${compact(place.distance)} km'
                  : place.detail,
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (ranked && place.value != null) Text(compact(place.value)),
                const Icon(Icons.chevron_right),
              ],
            ),
            selected: _other?.id == place.id,
            onTap: place.id.isEmpty
                ? null
                : () => setState(() => _other = place),
          ),
          const Divider(height: 1),
        ],
      );

  void _pick(BuildContext context, bool base) => showPlaceSwitcher(
    context,
    title: t(context, base ? 'Choose your place' : 'Compare with'),
    onPick: (PickedPlace place) => setState(() {
      final picked = ComparisonPlace(place.id, place.name, '', null, null);
      if (base) {
        _base = picked;
        _other = null;
      } else {
        _other = picked;
      }
    }),
  );
}

class _ComparisonPair extends StatelessWidget {
  const _ComparisonPair({required this.a, required this.b});
  final String a, b;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsComparison>(
    reloadKey: 'comparison|$a|$b',
    loading: const LoadingView(layout: LoadingLayout.compact),
    load: (_) => InsightsFeature(MziziApi.connection).getComparison(
      input: InsightsComparisonInput(a: a, b: b),
    ),
    builder: (context, raw) {
      final d = ComparisonDocument(raw);
      final comparable = d.rows
          .where(
            (r) =>
                r.a != null &&
                r.b != null &&
                r.a! >= 0 &&
                r.b! >= 0 &&
                math.max(r.a!, r.b!) > 0,
          )
          .take(5)
          .toList();
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text(
            '${d.a.name} · ${d.b.name}',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          if (comparable.length >= 3) ...[
            const SizedBox(height: 20),
            RadarCompare(
              axes: [for (var i = 0; i < comparable.length; i++) '${i + 1}'],
              series: [
                (
                  label: d.a.name,
                  values: [
                    for (final row in comparable)
                      row.a! / math.max(row.a!, row.b!),
                  ],
                ),
                (
                  label: d.b.name,
                  values: [
                    for (final row in comparable)
                      row.b! / math.max(row.a!, row.b!),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),
            const Tx(
              'Each axis is scaled to the larger of the two values. It is a comparison, not an overall score.',
            ),
            for (var i = 0; i < comparable.length; i++)
              Text(
                '${i + 1}. ${comparable[i].title}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
          ],
          if (d.rows.isEmpty)
            const EmptyState(
              icon: 'chart',
              title: 'Not enough data to compare',
            ),
          for (final row in d.rows)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    row.title,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 12),
                  if (row.a != null && row.b != null)
                    VBarChart(
                      height: 140,
                      items: [
                        (label: 'A', value: row.a!),
                        (label: 'B', value: row.b!),
                      ],
                    ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          '${d.a.name}\n${compact(row.a)} ${row.unit}',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          '${d.b.name}\n${compact(row.b)} ${row.unit}',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    comparisonDelta(context, row.a, row.b, d.b.name),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (row.a == null || row.b == null)
                    const Tx(
                      'Missing values are shown as a dash, never as zero.',
                    ),
                  const SizedBox(height: 12),
                  const Divider(height: 1),
                ],
              ),
            ),
          GapsNote(items: d.gaps, topic: 'comparison'),
        ],
      );
    },
  );
}
