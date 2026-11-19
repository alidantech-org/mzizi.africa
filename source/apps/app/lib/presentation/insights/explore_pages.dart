import 'package:mzizi_app/presentation/i18n/copy.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';
import 'package:mzizi_app/presentation/widgets/charts.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

InsightsFeature get _api => InsightsFeature(MziziApi.connection);

/// Where a search hit opens.
String hitPath(InsightsSearchHit hit) => switch (hit.kind) {
  'place' => '/place-profile?featureId=${hit.id}',
  'leader' => '/leader/${hit.id}',
  'party' => '/party/${hit.code}',
  'project' => '/project/${hit.code}',
  'tender' => '/tenders',
  'indicator' => '/stats/${hit.featureId ?? ''}',
  _ => '/sources',
};

const _icons = {
  'place': 'pin',
  'leader': 'user',
  'party': 'flag',
  'project': 'build',
  'tender': 'document',
  'indicator': 'chart',
  'source': 'book',
  'law': 'shield',
};

/// Search across everything; each hit is labelled with what it is and where it sits in the hierarchy.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _text = TextEditingController();
  Future<ApiResult<InsightsSearchResults>>? _future;
  String _kind = 'all';

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  void _run(String q) => setState(
    () => _future = q.trim().length < 2
        ? null
        : _api.globalSearch(
            input: InsightsSearchQuery(query: q.trim(), limit: 40),
          ),
  );

  @override
  Widget build(BuildContext context) => SafeArea(
    bottom: false,
    child: PageFrame(
      children: [
        Heading(
          'Search everything',
          kicker: 'Places · leaders · parties · projects',
        ),
        TextField(
          controller: _text,
          autofocus: false,
          textInputAction: TextInputAction.search,
          onChanged: _run,
          decoration: const InputDecoration(
            prefixIcon: MzIcon('search'),
            hintText: 'Westlands, a leader, a party, a project…',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(40)),
            ),
          ),
        ),
        const SizedBox(height: 12),
        if (_future == null)
          const GlassCard(
            child: Text(
              'Type at least two letters. Results are labelled so you can tell a ward from a person from a project.',
            ),
          )
        else
          FutureBuilder<ApiResult<InsightsSearchResults>>(
            future: _future,
            builder: (context, snap) {
              if (snap.connectionState != ConnectionState.done) {
                return const LoadingView(layout: LoadingLayout.compact);
              }
              final data = snap.data?.dataOrNull;
              if (data == null) {
                return ErrorView(
                  message: snap.data?.message ?? 'Search failed',
                  retryLabel: t(context, 'Try again'),
                  onRetry: () => _run(_text.text),
                );
              }
              final counts = asMap(data.counts);
              final shown = data.hits
                  .where((h) => _kind == 'all' || h.kind == _kind)
                  .toList();
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (shown.isEmpty)
                    EmptyState(
                      icon: 'search',
                      title: t(context, 'No results match your search.'),
                      body: t(context, 'Try another name or category.'),
                    ),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text('All · ${data.total}'),
                            selected: _kind == 'all',
                            onSelected: (_) => setState(() => _kind = 'all'),
                          ),
                        ),
                        for (final e in counts.entries.where(
                          (e) => (e.value as num) > 0,
                        ))
                          Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: ChoiceChip(
                              label: Text('${words(e.key)} · ${e.value}'),
                              selected: _kind == e.key,
                              onSelected: (_) => setState(() => _kind = e.key),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (shown.isEmpty) const Text('Nothing matches.'),
                  for (final hit in shown)
                    GlassCard(
                      margin: const EdgeInsets.only(bottom: 8),
                      onTap: () => context.push(hitPath(hit)),
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: MziziTokens.clay.withValues(
                              alpha: 0.15,
                            ),
                            child: MzIcon(
                              _icons[hit.kind] ?? 'info',
                              color: MziziTokens.clay,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  hit.title,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                if (hit.subtitle != null)
                                  Text(
                                    hit.subtitle!,
                                    style: Theme.of(
                                      context,
                                    ).textTheme.bodySmall,
                                  ),
                                if (hit.path.length > 1)
                                  Text(
                                    hit.path.skip(1).join(' › '),
                                    style: Theme.of(
                                      context,
                                    ).textTheme.bodySmall,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                              ],
                            ),
                          ),
                          Pill(hit.kindLabel),
                        ],
                      ),
                    ),
                ],
              );
            },
          ),
      ],
    ),
  );
}

/// The hierarchy one level at a time.
class BrowseScreen extends StatelessWidget {
  const BrowseScreen({super.key, this.featureId});
  final String? featureId;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPlaceBrowse>(
    reloadKey: 'browse|$featureId',
    load: (_) =>
        _api.browsePlaces(input: InsightsBrowseInput(featureId: featureId)),
    builder: (context, d) => PageFrame(
      crumbs: [
        (label: 'Explore', path: '/explore'),
        for (final c in d.chain)
          (label: c.name, path: '/browse/${c.featureId}'),
      ],
      children: [
        Heading(d.place?.name ?? AppCountry.name, kicker: d.place?.kindLabel),
        if (featureId != null)
          Wrap(
            spacing: 8,
            children: [
              FilledButton(
                onPressed: () =>
                    context.push('/place-profile?featureId=$featureId'),
                child: const Text('Who serves here'),
              ),
              OutlinedButton(
                onPressed: () => context.push('/stats/$featureId'),
                child: const Text('Statistics'),
              ),
              OutlinedButton(
                onPressed: () => context.push('/place-elections/$featureId'),
                child: const Text('Elections'),
              ),
              OutlinedButton(
                onPressed: () => context.push('/civic/$featureId'),
                child: const Text('Money'),
              ),
            ],
          ),
        const SizedBox(height: 12),
        for (final c in d.children)
          GlassCard(
            margin: const EdgeInsets.only(bottom: 8),
            onTap: () => context.push(
              c.childCount > 0
                  ? '/browse/${c.featureId}'
                  : '/place-profile?featureId=${c.featureId}',
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        c.name,
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(fontFamily: 'Georgia'),
                      ),
                      Text(
                        '${c.kindLabel}${c.childCount > 0 ? ' · ${c.childCount} inside' : ''}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      compact(c.population),
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                    Text(
                      'people',
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                  ],
                ),
              ],
            ),
          ),
        if (d.children.isEmpty)
          const GapsNote(
            items: ['No smaller places are recorded inside this one yet.'],
            topic: 'places inside',
          ),
      ],
    ),
  );
}

/// A place's statistics; breakdowns and comparison open in sheets.
class StatsScreen extends StatelessWidget {
  const StatsScreen({super.key, this.featureId});
  final String? featureId;
  @override
  Widget build(BuildContext context) {
    if (featureId == null) return const _NationalStats();
    return AsyncPage<InsightsPlaceStatistics>(
      reloadKey: 'stats|$featureId',
      load: (_) => _api.getPlaceStatistics(featureId: featureId!),
      builder: (context, d) {
        final topics = asMaps(d.topics);
        final indicators = [for (final t in topics) ...asMaps(t['indicators'])];
        Map<String, dynamic>? one(String code) => indicators
            .cast<Map<String, dynamic>?>()
            .firstWhere((i) => i!['code'] == code, orElse: () => null);
        final pop = one('sta.population.total');
        final density = one('sta.population.density');
        final area = one('sta.area.km2');
        final b = asMap(d.breakdowns);
        final series = asMaps(pop?['series']);
        return PageFrame(
          crumbs: [
            (label: 'Statistics', path: '/stats'),
            for (final c in d.chain)
              (label: c.name, path: '/stats/${c.featureId}'),
          ],
          children: [
            Heading(d.place.name, kicker: '${d.place.kindLabel} · statistics'),
            TileGrid(
              children: [
                StatTile(
                  label: 'Population',
                  value: compact(asNum(asMap(pop?['latest'])['value'])),
                ),
                StatTile(
                  label: 'People per km²',
                  value: compact(asNum(asMap(density?['latest'])['value'])),
                ),
                StatTile(
                  label: 'Area',
                  value:
                      '${compact(asNum(asMap(area?['latest'])['value']))} km²',
                ),
                StatTile(
                  label: 'Rank',
                  value:
                      '#${asMap(asMap(d.siblings)['population'])['position'] ?? '—'}',
                  hint:
                      'of ${asMap(asMap(d.siblings)['population'])['of'] ?? '—'} alike',
                ),
              ],
            ),
            const Heading('Population over time'),
            GlassCard(
              child: SeriesChart(
                values: [for (final p in series) asNum(p['value']) ?? 0],
                labels: [
                  for (final p in series)
                    asText(p['period']).padRight(4).substring(0, 4),
                ],
              ),
            ),
            const Heading('Who lives here'),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final key in [
                  'sex',
                  'age',
                  'residence',
                  'community',
                  'language',
                ])
                  if (asMaps(b[key]).isNotEmpty)
                    ActionChip(
                      avatar: MzIcon('chart', size: 18),
                      label: Text(words(key == 'sex' ? 'women and men' : key)),
                      onPressed: () => showInfoSheet(
                        context,
                        title: words(key == 'sex' ? 'women and men' : key),
                        builder: (_) => BarList(
                          items: [
                            for (final s in asMaps(b[key]))
                              (
                                label: asText(s['label']),
                                value: key == 'language'
                                    ? asNum(s['value']) ?? 0
                                    : asNum(s['share']) ?? 0,
                                note: key == 'language'
                                    ? null
                                    : compact(asNum(s['value'])),
                              ),
                          ],
                          format: key == 'language' ? compact : (v) => pct(v),
                        ),
                      ),
                    ),
              ],
            ),
            for (final topic in topics)
              if (asMaps(topic['indicators']).any(
                (i) => !{
                  'sta.population.total',
                  'sta.population.density',
                  'sta.area.km2',
                  'sta.population.language-speakers',
                }.contains(i['code']),
              )) ...[
                Heading(asText(topic['label'])),
                for (final i in asMaps(topic['indicators']).where(
                  (i) => !{
                    'sta.population.total',
                    'sta.population.density',
                    'sta.area.km2',
                    'sta.population.language-speakers',
                  }.contains(i['code']),
                ))
                  GlassCard(
                    margin: const EdgeInsets.only(bottom: 8),
                    onTap: () => showInfoSheet(
                      context,
                      title: asText(i['name']),
                      builder: (_) => SeriesChart(
                        values: [
                          for (final p in asMaps(i['series']))
                            asNum(p['value']) ?? 0,
                        ],
                        labels: [
                          for (final p in asMaps(i['series']))
                            asText(p['period']).padRight(4).substring(0, 4),
                        ],
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(child: Text(asText(i['name']))),
                        if (asMaps(i['series']).length > 1) ...[
                          Sparkline(
                            values: [
                              for (final point in asMaps(i['series']))
                                if (asNum(point['value']) != null)
                                  asNum(point['value'])!,
                            ],
                            width: 64,
                            height: 28,
                          ),
                          const SizedBox(width: 10),
                        ],
                        Text(
                          '${compact(asNum(asMap(i['latest'])['value']))} ${asText(i['unit'])}',
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
              ],
            const Heading('Against its parents'),
            for (final c in asMaps(d.comparisons))
              GlassCard(
                margin: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Expanded(child: Text(asText(asMap(c['place'])['name']))),
                    Text(
                      '${compact(asNum(c['population']))} · ${compact(asNum(c['density']))}/km²',
                    ),
                  ],
                ),
              ),
            GapsNote(items: d.gaps, topic: 'statistics for ${d.place.name}'),
          ],
        );
      },
    );
  }
}

class _NationalStats extends StatelessWidget {
  const _NationalStats();
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsIndicatorMap>(
    reloadKey: 'stats-map',
    load: (_) => _api.getIndicatorMap(
      indicatorCode: 'sta.population.total',
      kindCode: 'county',
    ),
    builder: (context, d) {
      final units = asMaps(d.units);
      final values = [for (final u in units) asNum(u['value']) ?? 0];
      final top = values.fold<double>(1, (a, b) => a > b ? a : b);
      return PageFrame(
        crumbs: const [
          (label: 'Explore', path: '/explore'),
          (label: 'Statistics', path: null),
        ],
        children: [
          const Heading('Population by county', kicker: 'Statistics'),
          RegionMap(
            regions: [
              for (final u in units)
                (
                  id: asText(u['featureId']),
                  name: asText(u['name']),
                  geometry: u['geometry'],
                  fill: Color.lerp(
                    MziziTokens.rampLow,
                    MziziTokens.rampHigh,
                    ((asNum(u['value']) ?? 0) / top).clamp(0.0, 1.0),
                  )!,
                ),
            ],
            height: 330,
            onTap: (id) => context.push('/stats/$id'),
          ),
          const SizedBox(height: 12),
          for (final u in units.take(47))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              onTap: () => context.push('/stats/${u['featureId']}'),
              child: Row(
                children: [
                  SizedBox(width: 28, child: Text('${u['rank'] ?? ''}')),
                  Expanded(child: Text(asText(u['name']))),
                  Text(
                    compact(asNum(u['value'])),
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
        ],
      );
    },
  );
}
