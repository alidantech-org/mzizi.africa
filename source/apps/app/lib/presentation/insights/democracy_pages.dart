import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

InsightsFeature get _api => InsightsFeature(MziziApi.connection);

class ElectionsScreen extends StatelessWidget {
  const ElectionsScreen({super.key});
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsElectionList>(
    reloadKey: 'elections',
    load: (_) => _api.listElections(),
    builder: (context, d) => PageFrame(
      crumbs: const [
        (label: 'Explore', path: '/explore'),
        (label: 'Elections', path: null),
      ],
      children: [
        const Heading('Elections', kicker: 'Votes and voters'),
        for (final e in asMaps(d.elections))
          GlassCard(
            margin: const EdgeInsets.only(bottom: 12),
            onTap: () => context.go('/election/${e['electionId']}'),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${e['year']} general election',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontFamily: 'Georgia'),
                ),
                Text(
                  '${e['heldOn']}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 8),
                Text(
                  'Registered voters: ${compact(asNum(e['registeredVoters']))}',
                ),
                if (e['winner'] != null)
                  Text(
                    'President: ${asMap(e['winner'])['name']} · ${compact(asNum(asMap(e['winner'])['votes']))} votes',
                  ),
              ],
            ),
          ),
      ],
    ),
  );
}

/// One election: a winner heat map; tap a region (or a row) for the full result in a sheet.
class ElectionScreen extends StatefulWidget {
  const ElectionScreen({super.key, required this.id});
  final String id;
  @override
  State<ElectionScreen> createState() => _ElectionScreenState();
}

class _ElectionScreenState extends State<ElectionScreen> {
  String? _contest;
  String _lens = 'winner';
  static const _palette = [
    MziziTokens.clay,
    MziziTokens.indigo,
    MziziTokens.raffia,
    MziziTokens.calabash,
    MziziTokens.plum,
    MziziTokens.lagoon,
  ];

  void _unit(BuildContext context, Map<String, dynamic> u) => showInfoSheet(
    context,
    title: asText(u['name']),
    builder: (_) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${compact(asNum(u['registered']))} registered · turnout ${pct(asNum(u['turnout']))}',
        ),
        const SizedBox(height: 12),
        BarList(
          items: [
            for (final c in asMaps(u['candidates']).take(6))
              (
                label: '${c['name']} (${c['party'] ?? 'ind.'})',
                value: asNum(c['share']) ?? 0,
                note: compact(asNum(c['votes'])),
              ),
          ],
          format: (v) => pct(v),
        ),
        const SizedBox(height: 12),
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop();
            context.go('/place-elections/${u['featureId']}');
          },
          child: const Text("This place's history"),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) => AsyncPage<InsightsElectionDetail>(
    reloadKey: 'election|${widget.id}|$_contest',
    load: (_) => _api.getElection(electionId: widget.id, contestKind: _contest),
    builder: (context, d) {
      final units = asMaps(d.units);
      final parties = {
        for (final u in units)
          asText(asMap(u['winner'])['partyCode'], 'independent'),
      }.toList();
      final maxTurn = units.fold<double>(
        0.01,
        (a, u) => (asNum(u['turnout']) ?? 0) > a ? asNum(u['turnout'])! : a,
      );
      Color fill(Map<String, dynamic> u) => _lens == 'turnout'
          ? Color.lerp(
              MziziTokens.rampLow,
              MziziTokens.rampHigh,
              ((asNum(u['turnout']) ?? 0) / maxTurn).clamp(0, 1),
            )!
          : _palette[parties.indexOf(
                  asText(asMap(u['winner'])['partyCode'], 'independent'),
                ) %
                _palette.length];
      final election = asMap(d.election);
      return PageFrame(
        crumbs: [
          (label: 'Elections', path: '/elections'),
          (label: '${election['year']}', path: null),
        ],
        children: [
          Heading(
            '${election['year']} general election',
            kicker: asText(election['heldOn']),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (final c in asMaps(d.contests))
                  Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: ChoiceChip(
                      label: Text(words(asText(c['kind']))),
                      selected: asText(election['contestKind']) == c['kind'],
                      onSelected: (_) =>
                          setState(() => _contest = asText(c['kind'])),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          SegmentedButton<String>(
            showSelectedIcon: false,
            segments: const [
              ButtonSegment(value: 'winner', label: Text('Winner')),
              ButtonSegment(value: 'turnout', label: Text('Turnout')),
            ],
            selected: {_lens},
            onSelectionChanged: (s) => setState(() => _lens = s.first),
          ),
          const SizedBox(height: 10),
          RegionMap(
            regions: [
              for (final u in units)
                (
                  id: asText(u['featureId']),
                  name: asText(u['name']),
                  geometry: u['geometry'],
                  fill: fill(u),
                ),
            ],
            height: 320,
            onTap: (id) => _unit(
              context,
              units.firstWhere(
                (u) => u['featureId'] == id,
                orElse: () => const {},
              ),
            ),
          ),
          const Heading('Top candidates'),
          for (final t in asMaps(d.totals).take(4))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      '${t['name']} · ${t['party'] ?? 'Independent'}',
                    ),
                  ),
                  Text(
                    '${compact(asNum(t['votes']))} (${pct(asNum(t['share']))})',
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          const Heading('By region'),
          for (final u in units)
            GlassCard(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              onTap: () => _unit(context, u),
              child: Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: fill(u),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: Text(asText(u['name']))),
                  Text(
                    asText(asMap(u['winner'])['name']),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          GapsNote(items: d.gaps, topic: 'election results'),
        ],
      );
    },
  );
}

class PlaceElectionsScreen extends StatelessWidget {
  const PlaceElectionsScreen({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPlaceElections>(
    reloadKey: 'pe|$id',
    load: (_) => _api.getPlaceElections(featureId: id),
    builder: (context, d) => PageFrame(
      crumbs: [
        (label: 'Elections', path: '/elections'),
        (label: d.place.name, path: null),
      ],
      children: [
        Heading(d.place.name, kicker: 'Elections here'),
        if (d.registrationTrend.length > 1) ...[
          const Heading('Registered voters'),
          GlassCard(
            child: SeriesChart(
              values: [
                for (final p in asMaps(d.registrationTrend))
                  asNum(p['value']) ?? 0,
              ],
              labels: [
                for (final p in asMaps(d.registrationTrend))
                  asText(p['period']).substring(0, 4),
              ],
            ),
          ),
        ],
        for (final e in asMaps(d.elections)) ...[
          Heading('${e['year']} general election'),
          for (final c in asMaps(e['contests']))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 10),
              onTap: () => showInfoSheet(
                context,
                title: '${e['year']} · ${words(asText(c['kind']))}',
                builder: (_) => BarList(
                  items: [
                    for (final x in asMaps(c['candidates']))
                      (
                        label:
                            '${x['won'] == true ? '★ ' : ''}${x['name']} (${x['party'] ?? 'ind.'})',
                        value: asNum(x['share']) ?? 0,
                        note: compact(asNum(x['votes'])),
                      ),
                  ],
                  format: (v) => pct(v),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    words(asText(c['kind'])),
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Text(
                    'Won by ${asMap(asMaps(c['candidates']).first)['name']} · turnout ${pct(asNum(c['turnout']))}',
                  ),
                ],
              ),
            ),
        ],
        GapsNote(items: d.gaps, topic: 'elections in ${d.place.name}'),
      ],
    ),
  );
}

class ParliamentScreen extends StatelessWidget {
  const ParliamentScreen({super.key});
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsMotionList>(
    reloadKey: 'motions',
    load: (_) => _api.listMotions(),
    builder: (context, d) => PageFrame(
      crumbs: const [
        (label: 'Explore', path: '/explore'),
        (label: 'Parliament', path: null),
      ],
      children: [
        const Heading('Decisions', kicker: 'Parliament and other bodies'),
        for (final m in asMaps(d.motions))
          GlassCard(
            margin: const EdgeInsets.only(bottom: 10),
            onTap: () => context.go('/motion/${m['code']}'),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 6,
                  children: [
                    Pill(
                      words(asText(m['outcome'])),
                      color: toneColor(asText(m['outcome'])),
                    ),
                    Pill(words(asText(m['kind']))),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  asText(m['title']),
                  style: Theme.of(
                    context,
                  ).textTheme.titleMedium?.copyWith(fontFamily: 'Georgia'),
                ),
                Text(
                  '${m['institution']} · ${m['held_on']}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  '${m['yes']} yes · ${m['no']} no · ${m['abstain']} abstained · ${m['absent']} absent',
                ),
              ],
            ),
          ),
      ],
    ),
  );
}

/// The round table of one decision; tapping a dot opens the member in a sheet.
class MotionScreen extends StatelessWidget {
  const MotionScreen({super.key, required this.code});
  final String code;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsMotionDetail>(
    reloadKey: 'motion|$code',
    load: (_) => _api.getMotion(code: code),
    builder: (context, d) {
      final motion = asMap(d.motion), tally = asMap(d.tally);
      final members = asMaps(d.members);
      return PageFrame(
        crumbs: [
          (label: 'Parliament', path: '/parliament'),
          (label: asText(motion['title']), path: null),
        ],
        children: [
          Wrap(
            spacing: 6,
            children: [
              Pill(
                words(asText(motion['outcome'])),
                color: toneColor(asText(motion['outcome'])),
              ),
              Pill(words(asText(motion['kind']))),
            ],
          ),
          Heading(asText(motion['title']), kicker: '${motion['held_on']}'),
          Text(asText(motion['summary'])),
          const SizedBox(height: 12),
          TileGrid(
            children: [
              StatTile(
                label: 'Yes',
                value: '${tally['yes']}',
                color: MziziTokens.raffia,
              ),
              StatTile(
                label: 'No',
                value: '${tally['no']}',
                color: MziziTokens.danger,
              ),
              StatTile(label: 'Abstained', value: '${tally['abstain']}'),
              StatTile(
                label: 'Absent',
                value: '${tally['absent']}',
                hint: '${tally['total']} members',
              ),
            ],
          ),
          const Heading('How each member voted', kicker: 'Round table'),
          GlassCard(
            child: Hemicycle(
              members: members,
              onSelect: (m) => showInfoSheet(
                context,
                title: asText(m['name']),
                initial: 0.4,
                builder: (_) => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${m['party'] ?? 'No party'} · ${m['unit'] ?? m['office'] ?? ''}',
                    ),
                    const SizedBox(height: 8),
                    Pill(
                      words(asText(m['position'])),
                      color: toneColor(asText(m['position'])),
                    ),
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                        context.go('/leader/${m['holderId']}');
                      },
                      child: const Text('Open leader'),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const Heading('Votes by party'),
          for (final p in asMaps(d.parties).take(6))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  Expanded(child: Text(asText(p['party']))),
                  Text(
                    '${p['yes']}✓ ${p['no']}✗ ${p['absent']} away',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            icon: const Icon(Icons.list),
            label: const Text('Every vote'),
            onPressed: () => showInfoSheet(
              context,
              title: 'Every vote (${members.length})',
              initial: 0.8,
              builder: (_) => Column(
                children: [
                  for (final m in members)
                    ListTile(
                      dense: true,
                      title: Text(asText(m['name'])),
                      subtitle: Text(asText(m['party'], 'No party')),
                      trailing: Pill(
                        words(asText(m['position'])),
                        color: toneColor(asText(m['position'])),
                      ),
                      onTap: () {
                        Navigator.of(context).pop();
                        context.go('/leader/${m['holderId']}');
                      },
                    ),
                ],
              ),
            ),
          ),
          GapsNote(items: d.gaps, topic: asText(motion['title'])),
        ],
      );
    },
  );
}

class PartiesScreen extends StatelessWidget {
  const PartiesScreen({super.key});
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPartyList>(
    reloadKey: 'parties',
    load: (_) => _api.listParties(),
    builder: (context, d) => PageFrame(
      crumbs: const [
        (label: 'Explore', path: '/explore'),
        (label: 'Parties', path: null),
      ],
      children: [
        const Heading('Parties, ranked'),
        for (final (i, p) in asMaps(d.parties).indexed)
          GlassCard(
            margin: const EdgeInsets.only(bottom: 8),
            onTap: () => context.go('/party/${p['code']}'),
            child: Row(
              children: [
                SizedBox(width: 30, child: Text('${i + 1}')),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        asText(p['name']),
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                      Text(
                        '${compact(asNum(p['votes2022']))} votes · ${p['members']} members · ${ksh(asNum(p['fundAllocationKes']))}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        GapsNote(items: d.gaps, topic: 'party data'),
      ],
    ),
  );
}

class PartyScreen extends StatelessWidget {
  const PartyScreen({super.key, required this.code});
  final String code;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsPartyDetail>(
    reloadKey: 'party|$code',
    load: (_) => _api.getParty(code: code),
    builder: (context, d) {
      final party = asMap(d.party), members = asMaps(d.members);
      return PageFrame(
        crumbs: [
          (label: 'Parties', path: '/parties'),
          (label: asText(party['name']), path: null),
        ],
        children: [
          Heading(asText(party['name']), kicker: 'Political party'),
          TileGrid(
            children: [
              StatTile(label: 'Members', value: '${members.length}'),
              StatTile(
                label: 'Latest fund',
                value: ksh(
                  asNum(
                    asMaps(d.funding).isEmpty
                        ? null
                        : asMaps(d.funding).last['amountKes'],
                  ),
                ),
              ),
            ],
          ),
          const Heading('Votes obtained'),
          for (final r in asMaps(d.results))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      '${r['year']} · ${words(asText(r['contest']))}',
                    ),
                  ),
                  Text(
                    compact(asNum(r['votes'])),
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          const Heading('Members'),
          for (final m in members.take(60))
            ListTile(
              dense: true,
              title: Text(asText(m['name'])),
              subtitle: Text(
                '${m['office'] ?? 'Member'}${m['unit'] == null ? '' : ' · ${m['unit']}'}',
              ),
              onTap: m['holderId'] == null
                  ? null
                  : () => context.go('/leader/${m['holderId']}'),
            ),
          GapsNote(items: d.gaps, topic: asText(party['name'])),
        ],
      );
    },
  );
}

/// A leader: contacts open actions in a sheet, the record and the fund below.
class LeaderScreen extends StatelessWidget {
  const LeaderScreen({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsLeaderProfile>(
    reloadKey: 'leader|$id',
    load: (_) => _api.getLeaderProfile(id: id),
    builder: (context, d) {
      final l = asMap(d.leader),
          a = asMap(d.activity),
          v = asMap(a['votes']),
          fund = asMap(d.fund);
      final photo = asMaps(
        d.media,
      ).where((m) => m['kind'] == 'portrait').firstOrNull;
      return PageFrame(
        crumbs: [
          (
            label: asText(l['unit'], 'Place'),
            path: l['unitId'] == null
                ? null
                : '/place-profile?featureId=${l['unitId']}',
          ),
          (label: asText(l['name']), path: null),
        ],
        children: [
          GlassCard(
            child: Row(
              children: [
                CircleAvatar(
                  radius: 38,
                  backgroundColor: MziziTokens.clay,
                  foregroundImage: photo == null
                      ? null
                      : NetworkImage(asText(photo['url'])),
                  child: Text(
                    asText(l['name'])
                        .split(' ')
                        .map((w) => w.isEmpty ? '' : w[0])
                        .take(2)
                        .join(),
                    style: const TextStyle(
                      color: MziziTokens.cream,
                      fontSize: 24,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        asText(l['office']).toUpperCase(),
                        style: const TextStyle(
                          color: MziziTokens.clay,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        asText(l['name']),
                        style: Theme.of(context).textTheme.headlineSmall
                            ?.copyWith(fontFamily: 'Georgia'),
                      ),
                      Text(
                        '${l['party'] ?? 'No party'}${l['unit'] == null ? '' : ' · ${l['unit']}'}',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          TileGrid(
            children: [
              StatTile(
                label: 'Attendance',
                value: pct(asNum(v['attendance']), 0),
                hint: '${v['total']} divisions',
              ),
              StatTile(
                label: 'Speeches',
                value: '${asMap(a['contributions'])['count']}',
              ),
            ],
          ),
          const Heading('Get in touch'),
          if (d.contacts.isEmpty)
            const Text('No public contact details are recorded.'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final c in asMaps(d.contacts))
                ActionChip(
                  avatar: Icon(_contactIcon(asText(c['kind'])), size: 18),
                  label: Text(words(asText(c['kind']))),
                  onPressed: () => showInfoSheet(
                    context,
                    title: words(asText(c['kind'])),
                    initial: 0.3,
                    builder: (_) => SelectableText(
                      asText(c['value']),
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ),
                ),
            ],
          ),
          if (d.election.isNotEmpty) ...[
            const Heading('How they got the seat'),
            for (final e in asMaps(d.election))
              GlassCard(
                margin: const EdgeInsets.only(bottom: 8),
                child: Text(
                  '${e['year']}: ${compact(asNum(e['votes']))} votes (${pct(asNum(e['share']))}), lead of ${pct(asNum(e['margin']))}',
                ),
              ),
          ],
          const Heading('Recent decisions'),
          for (final r in asMaps(a['recent']).take(8))
            GlassCard(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              onTap: () => context.go('/motion/${r['code']}'),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      asText(r['title']),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Pill(
                    words(asText(r['position'])),
                    color: toneColor(asText(r['position'])),
                  ),
                ],
              ),
            ),
          if (fund.isNotEmpty) ...[
            Heading('Development fund · ${asMap(fund['place'])['name']}'),
            GlassCard(
              onTap: () =>
                  context.go('/civic/${asMap(fund['place'])['featureId']}'),
              child: Text(
                '${ksh(asNum(asMap(fund['latestYear'])['total']))} in ${asMap(fund['latestYear'])['year']} · ${asMap(fund['infrastructure'])['projects']} projects. Tap for everything funded here.',
              ),
            ),
          ],
          GapsNote(items: d.gaps, topic: asText(l['name'])),
        ],
      );
    },
  );
}

IconData _contactIcon(String kind) => switch (kind) {
  'email' => Icons.email_outlined,
  'mobile' || 'telephone' => Icons.phone_outlined,
  'website' => Icons.public,
  'physical-address' => Icons.place_outlined,
  _ => Icons.alternate_email,
};
