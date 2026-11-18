import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart' hide Path;
import 'package:flutter_map/flutter_map.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

InsightsFeature get _api => InsightsFeature(MziziApi.connection);

class CivicHubScreen extends StatelessWidget {
  const CivicHubScreen({super.key});
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsLeaderboard>(
    reloadKey: 'civic-hub',
    load: (_) => _api.getLeaderboard(
      metricCode: 'civ.projects.per-100k',
      kindCode: 'constituency',
      limit: 10,
    ),
    builder: (context, d) => PageFrame(
      crumbs: const [
        (label: 'Explore', path: '/explore'),
        (label: 'Money & projects', path: null),
      ],
      children: [
        const Heading('Money & projects', kicker: 'Where the money goes'),
        FilledButton.icon(
          onPressed: () => context.go('/browse'),
          icon: const Icon(Icons.search),
          label: const Text('Find your area'),
        ),
        Heading(d.metric.title),
        for (final r in d.rows)
          GlassCard(
            margin: const EdgeInsets.only(bottom: 6),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            onTap: () => context.go('/civic/${r.featureId}'),
            child: Row(
              children: [
                SizedBox(width: 28, child: Text('${r.rank}')),
                Expanded(child: Text(r.name)),
                Text(
                  compact(r.value),
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ],
            ),
          ),
      ],
    ),
  );
}

class CivicScreen extends StatefulWidget {
  const CivicScreen({super.key, required this.id});
  final String id;
  @override
  State<CivicScreen> createState() => _CivicScreenState();
}

class _CivicScreenState extends State<CivicScreen> {
  String _status = 'all';
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPlaceCivic>(
    reloadKey: 'civic|${widget.id}',
    load: (_) => _api.getPlaceCivic(featureId: widget.id),
    builder: (context, d) {
      final i = asMap(d.infrastructure);
      final projects = asMaps(
        d.projects,
      ).where((p) => _status == 'all' || p['status'] == _status).toList();
      final pins = [
        for (final p in projects)
          if (p['location'] is Map)
            (
              p: p,
              at: LatLng(
                ((asMap(p['location'])['coordinates'] as List)[1] as num)
                    .toDouble(),
                ((asMap(p['location'])['coordinates'] as List)[0] as num)
                    .toDouble(),
              ),
            ),
      ];
      return PageFrame(
        crumbs: [
          (label: 'Money', path: '/civic'),
          for (final c in d.chain)
            (label: c.name, path: '/civic/${c.featureId}'),
        ],
        children: [
          Heading(d.place.name, kicker: 'Money and projects'),
          TileGrid(
            children: [
              StatTile(
                label: 'Latest allocation',
                value: ksh(
                  asNum(
                    asMaps(d.years).isEmpty
                        ? null
                        : asMaps(d.years).first['total'],
                  ),
                ),
                hint: asMaps(d.years).isEmpty
                    ? null
                    : '${asMaps(d.years).first['year']}',
              ),
              StatTile(
                label: 'Projects',
                value: '${i['projects']}',
                hint: '${pct(asNum(i['completionRate']), 0)} completed',
              ),
              StatTile(
                label: 'Per 100,000',
                value: compact(asNum(i['per100k'])),
              ),
              StatTile(
                label: 'Per 1,000 km²',
                value: compact(
                  asNum(i['perKm2']) == null
                      ? null
                      : asNum(i['perKm2'])! * 1000,
                ),
              ),
            ],
          ),
          if (d.classes.isNotEmpty) ...[
            const Heading('What the money was for'),
            GlassCard(
              child: BarList(
                items: [
                  for (final c in asMaps(d.classes).take(7))
                    (
                      label: asText(c['label']),
                      value: asNum(c['amount']) ?? 0,
                      note: null,
                    ),
                ],
                format: ksh,
              ),
            ),
          ],
          const Heading('On the map'),
          SegmentedButton<String>(
            showSelectedIcon: false,
            segments: const [
              ButtonSegment(value: 'all', label: Text('All')),
              ButtonSegment(value: 'completed', label: Text('Done')),
              ButtonSegment(value: 'ongoing', label: Text('Ongoing')),
              ButtonSegment(value: 'planned', label: Text('Planned')),
            ],
            selected: {_status},
            onSelectionChanged: (s) => setState(() => _status = s.first),
          ),
          const SizedBox(height: 10),
          if (pins.isNotEmpty)
            ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: SizedBox(
                height: 300,
                child: FlutterMap(
                  options: MapOptions(
                    initialCameraFit: CameraFit.bounds(
                      bounds: LatLngBounds.fromPoints([
                        for (final p in pins) p.at,
                      ]),
                      padding: const EdgeInsets.all(30),
                      maxZoom: 15,
                    ),
                    interactionOptions: const InteractionOptions(
                      flags: InteractiveFlag.drag | InteractiveFlag.pinchZoom,
                    ),
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'africa.mzizi.app',
                    ),
                    MarkerLayer(
                      markers: [
                        for (final p in pins)
                          Marker(
                            point: p.at,
                            width: 34,
                            height: 34,
                            child: GestureDetector(
                              onTap: () => _project(context, p.p),
                              child: Icon(
                                Icons.location_on,
                                color: toneColor(asText(p.p['status'])),
                                size: 34,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            )
          else
            const Text('No project here has a map location yet.'),
          const SizedBox(height: 10),
          for (final p in projects.take(30))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 8),
              onTap: () => _project(context, p),
              child: Row(
                children: [
                  if (p['media'] is Map)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        asText(asMap(p['media'])['url']),
                        width: 64,
                        height: 64,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const SizedBox(
                          width: 64,
                          height: 64,
                          child: Icon(Icons.construction),
                        ),
                      ),
                    )
                  else
                    const SizedBox(
                      width: 64,
                      height: 64,
                      child: Icon(Icons.construction),
                    ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          asText(p['name']),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 4),
                        Pill(
                          words(asText(p['status'])),
                          color: toneColor(asText(p['status'])),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          if (d.leadership.isNotEmpty) ...[
            const Heading('Leadership here'),
            for (final o in asMaps(d.leadership).take(6))
              ListTile(
                dense: true,
                title: Text(asText(o['personName'])),
                subtitle: Text(asText(o['officeTitle'])),
                onTap: () => context.go('/leader/${o['holderId']}'),
              ),
          ],
          GapsNote(
            items: d.gaps,
            topic: 'money and projects in ${d.place.name}',
          ),
        ],
      );
    },
  );

  void _project(BuildContext context, Map<String, dynamic> p) => showInfoSheet(
    context,
    title: asText(p['name']),
    builder: (_) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Pill(words(asText(p['status'])), color: toneColor(asText(p['status']))),
        const SizedBox(height: 8),
        Text(
          '${p['unit']}${p['started_on'] == null ? '' : ' · started ${p['started_on']}'}',
        ),
        if (p['amount'] != null) Text('Money: ${ksh(asNum(p['amount']))}'),
        if (p['contractor'] != null) Text('Contractor: ${p['contractor']}'),
        const SizedBox(height: 14),
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop();
            context.go('/project/${p['code']}');
          },
          child: const Text('Everything about this project'),
        ),
      ],
    ),
  );
}

class ProjectScreen extends StatelessWidget {
  const ProjectScreen({super.key, required this.code});
  final String code;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsProjectDetail>(
    reloadKey: 'project|$code',
    load: (_) => _api.getProject(code: code),
    builder: (context, d) {
      final p = asMap(d.project), pr = asMap(d.procurement);
      return PageFrame(
        crumbs: [
          (label: 'Money', path: '/civic'),
          (label: asText(p['unit']), path: '/civic/${p['unit_id']}'),
          (label: asText(p['name']), path: null),
        ],
        children: [
          Pill(
            words(asText(p['status'])),
            color: toneColor(asText(p['status'])),
          ),
          Heading(asText(p['name'])),
          Text(asText(p['description'])),
          if (d.media.isNotEmpty) ...[
            const Heading('Pictures'),
            SizedBox(
              height: 150,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  for (final m in asMaps(d.media))
                    if (m['stored'] == true || m['platform'] == 'pexels')
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            asText(m['url']),
                            width: 200,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const SizedBox(
                              width: 200,
                              child: Icon(Icons.image_not_supported),
                            ),
                          ),
                        ),
                      ),
                ],
              ),
            ),
          ],
          if (d.money.isNotEmpty) ...[
            const Heading('Money'),
            for (final m in asMaps(d.money))
              GlassCard(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${m['occurred_on']} · ${words(asText(m['kind']))} · ${m['class'] ?? ''}',
                      ),
                    ),
                    Text(
                      ksh(asNum(m['amount'])),
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
          ],
          if (pr.isNotEmpty) ...[
            Heading(asText(pr['title'], 'Tender')),
            GlassCard(
              onTap: () => showInfoSheet(
                context,
                title: 'Bids and contract',
                builder: (_) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final c in asMaps(pr['contracts']))
                      Text(
                        'Awarded to ${c['contractor']} · ${ksh(asNum(c['amount']))}',
                      ),
                    const SizedBox(height: 10),
                    for (final b in asMaps(pr['bids']))
                      ListTile(
                        dense: true,
                        title: Text(asText(b['bidder'])),
                        subtitle: Text(words(asText(b['outcome']))),
                        trailing: Text(ksh(asNum(b['amount']))),
                      ),
                  ],
                ),
              ),
              child: Text(
                '${words(asText(pr['status'], 'unknown'))} · buyer ${pr['buyer'] ?? '—'} · closes ${pr['closes_on'] ?? '—'}. Tap for the bids.',
              ),
            ),
          ],
          GapsNote(items: d.gaps, topic: asText(p['name'])),
        ],
      );
    },
  );
}

class TendersScreen extends StatelessWidget {
  const TendersScreen({super.key});
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsTenderList>(
    reloadKey: 'tenders',
    load: (_) => _api.listTenders(input: const InsightsTenderInput(limit: 60)),
    builder: (context, d) {
      final summary = asMap(d.summary);
      return PageFrame(
        crumbs: const [
          (label: 'Explore', path: '/explore'),
          (label: 'Tenders', path: null),
        ],
        children: [
          const Heading('Tenders & contracts', kicker: 'Public procurement'),
          TileGrid(
            children: [
              StatTile(label: 'On record', value: '${summary['total']}'),
              for (final s in asMaps(summary['byStatus']).take(3))
                StatTile(
                  label: words(asText(s['status'])),
                  value: '${s['count']}',
                ),
            ],
          ),
          const SizedBox(height: 10),
          for (final t in asMaps(d.tenders))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 8),
              onTap: () => showInfoSheet(
                context,
                title: asText(t['title']),
                builder: (_) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 6,
                      children: [
                        Pill(
                          words(asText(t['status'], 'unknown')),
                          color: toneColor(asText(t['status'])),
                        ),
                        Pill(words(asText(t['procedure']))),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text('Buyer: ${t['buyer'] ?? '—'}'),
                    Text('Reference: ${t['reference'] ?? 'not published'}'),
                    Text('Closes: ${t['closes_on'] ?? '—'}'),
                    Text('Supplier: ${t['supplier'] ?? 'not published'}'),
                    Text('Value: ${ksh(asNum(t['amount']))}'),
                    const SizedBox(height: 10),
                    Text(
                      '${t['disclosed']} of ${t['disclosedOf']} basic details published.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    asText(t['title']),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 4),
                  Wrap(
                    spacing: 6,
                    children: [
                      Pill(
                        words(asText(t['status'], 'unknown')),
                        color: toneColor(asText(t['status'])),
                      ),
                      Text(
                        asText(t['buyer']),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          GapsNote(items: d.gaps, topic: 'tenders and contracts'),
        ],
      );
    },
  );
}

class RankingsScreen extends StatefulWidget {
  const RankingsScreen({super.key});
  @override
  State<RankingsScreen> createState() => _RankingsScreenState();
}

class _RankingsScreenState extends State<RankingsScreen> {
  String _metric = 'civ.projects.per-100k';
  @override
  Widget build(BuildContext context) =>
      AsyncPage<InsightsLeaderboardMetricList>(
        reloadKey: 'metrics',
        load: (_) => _api.listLeaderboardMetrics(),
        builder: (context, list) => PageFrame(
          crumbs: const [
            (label: 'Explore', path: '/explore'),
            (label: 'Rankings', path: null),
          ],
          children: [
            const Heading('Rankings', kicker: 'Who is doing what'),
            OutlinedButton.icon(
              icon: const Icon(Icons.tune),
              label: Text(
                list.metrics
                    .firstWhere(
                      (m) => m.code == _metric,
                      orElse: () => list.metrics.first,
                    )
                    .title,
              ),
              onPressed: () => showInfoSheet(
                context,
                title: 'Choose a ranking',
                initial: 0.75,
                builder: (_) => Column(
                  children: [
                    for (final m in list.metrics)
                      ListTile(
                        title: Text(m.title),
                        subtitle: Text(
                          m.describe,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        selected: m.code == _metric,
                        onTap: () {
                          Navigator.of(context).pop();
                          setState(() => _metric = m.code);
                        },
                      ),
                  ],
                ),
              ),
            ),
            _Board(key: ValueKey(_metric), metric: _metric),
          ],
        ),
      );
}

class _Board extends StatelessWidget {
  const _Board({super.key, required this.metric});
  final String metric;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsLeaderboard>(
    reloadKey: 'board|$metric',
    load: (_) => _api.getLeaderboard(
      metricCode: metric,
      kindCode: 'constituency',
      limit: 50,
    ),
    builder: (context, d) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        Text(d.metric.describe, style: Theme.of(context).textTheme.bodySmall),
        Text(d.scope, style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: 8),
        for (final r in d.rows)
          GlassCard(
            margin: const EdgeInsets.only(bottom: 6),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            onTap: () => context.go(
              r.subjectId != null
                  ? '/leader/${r.subjectId}'
                  : '/civic/${r.featureId}',
            ),
            child: Row(
              children: [
                SizedBox(
                  width: 28,
                  child: Text(
                    '${r.rank}',
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
                Expanded(
                  child: Text(
                    r.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Text(
                  '${compact(r.value)} ${d.metric.unit ?? ''}',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ],
            ),
          ),
        GapsNote(items: d.gaps, topic: d.metric.title),
      ],
    ),
  );
}
