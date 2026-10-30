import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key, this.onNavigate});
  final ValueChanged<int>? onNavigate;

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final search = TextEditingController();
  final searchFocus = FocusNode();
  String era = 'All Eras';
  String county = 'Nakuru County';
  static const events = [
    _HistoryEvent(
      '1895',
      'Protectorate administration begins',
      'The British East Africa Protectorate is established. The region that later becomes Kenya is administered as a protectorate.',
      'COLONIAL PERIOD',
      'East Africa Protectorate records',
    ),
    _HistoryEvent(
      '1920',
      'Kenya Colony proclaimed',
      'The territory is formally designated the Kenya Colony, with changing administrative districts and boundaries.',
      'COLONIAL PERIOD',
      'Kenya Colony Gazette notices',
    ),
    _HistoryEvent(
      '1963',
      'Independence and self-government',
      'Kenya attains independence. Provincial and district administration continues through the early republic.',
      'REPUBLIC',
      'Independence instruments • Kenya National Archives',
    ),
    _HistoryEvent(
      '2010',
      'Constitution establishes 47 counties',
      'The Constitution introduces devolved government and lists the county boundaries and names in the First Schedule.',
      'DEVOLUTION',
      'Constitution of Kenya • First Schedule',
    ),
    _HistoryEvent(
      '2013',
      'County governments take office',
      'The first county administrations are established following the March 2013 general election.',
      'DEVOLUTION',
      'Transition Authority • County handover reports',
    ),
    _HistoryEvent(
      '2023–27',
      'Nakuru County development plan',
      'The County Integrated Development Plan sets the county planning framework and priority programmes for the period.',
      'COUNTY RECORD',
      'Nakuru CIDP 2023–2027',
    ),
  ];

  @override
  void dispose() {
    search.dispose();
    searchFocus.dispose();
    super.dispose();
  }

  void detail(
    String title,
    String body,
    String source,
  ) => showModalBottomSheet<void>(
    context: context,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: line,
                  borderRadius: BorderRadius.circular(5),
                ),
              ),
            ),
            const SizedBox(height: 17),
            Text(
              title,
              style: const TextStyle(
                fontSize: 22.5,
                fontWeight: FontWeight.w800,
                color: ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              body,
              style: const TextStyle(fontSize: 17, height: 1.4, color: muted),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFEEF4EF),
                borderRadius: BorderRadius.circular(9),
              ),
              child: Row(
                children: [
                  const Icon(Icons.source_outlined, size: 16, color: forest),
                  const SizedBox(width: 7),
                  Expanded(
                    child: Text(
                      source,
                      style: const TextStyle(fontSize: 14.5, color: ink),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Close'),
              ),
            ),
          ],
        ),
      ),
    ),
  );

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFF4F9F3),
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(12, 11, 12, 18),
                  sliver: SliverList.list(
                    children: [
                      _intro(),
                      const SizedBox(height: 11),
                      _searchBar(),
                      const SizedBox(height: 10),
                      _countyCard(),
                      const SizedBox(height: 11),
                      _eraFilters(),
                      const SizedBox(height: 13),
                      _timeline(),
                      const SizedBox(height: 12),
                      _boundaryCard(),
                      const SizedBox(height: 12),
                      _recordSection(),
                      const SizedBox(height: 12),
                      _sourceNote(),
                    ],
                  ),
                ),
              ],
            ),
          ),
          _bottomNav(),
        ],
      ),
    ),
  );

  Widget _header() => Container(
    padding: const EdgeInsets.fromLTRB(12, 7, 12, 7),
    decoration: const BoxDecoration(
      color: Color(0xFFF8FBF7),
      border: Border(bottom: BorderSide(color: line)),
    ),
    child: Row(
      children: [
        const Icon(Icons.history_edu, size: 20, color: forest),
        const SizedBox(width: 7),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w800,
                  color: deepGreen,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(fontSize: 10.5, color: muted),
              ),
            ],
          ),
        ),
        InkWell(
          onTap: () => showModalBottomSheet<void>(
            context: context,
            builder: (ctx) => SafeArea(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children:
                    [
                          'Nakuru County',
                          'Nairobi County',
                          'Kisumu County',
                          'Uasin Gishu County',
                        ]
                        .map(
                          (e) => ListTile(
                            title: Text(e),
                            onTap: () {
                              setState(() => county = e);
                              Navigator.pop(ctx);
                            },
                          ),
                        )
                        .toList(),
              ),
            ),
          ),
          child: Row(
            children: [
              const Icon(Icons.location_on_outlined, size: 12, color: forest),
              Text(county, style: const TextStyle(fontSize: 11.5, color: ink)),
              const Icon(Icons.keyboard_arrow_down, size: 13),
            ],
          ),
        ),
        IconButton(
          onPressed: searchFocus.requestFocus,
          icon: const Icon(Icons.search, size: 18),
          visualDensity: VisualDensity.compact,
        ),
        const CircleAvatar(
          radius: 12,
          backgroundColor: Color(0xFFBFD1C3),
          child: Icon(Icons.person, size: 14, color: deepGreen),
        ),
      ],
    ),
  );

  Widget _intro() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Row(
        children: [
          Icon(Icons.account_balance_outlined, size: 12, color: forest),
          SizedBox(width: 5),
          Text(
            'CIVIC HISTORY & ARCHIVES',
            style: TextStyle(
              fontSize: 11.5,
              letterSpacing: .4,
              color: forest,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
      const SizedBox(height: 4),
      const Text(
        'Kenya’s Civic Timeline',
        style: TextStyle(
          fontSize: 23.5,
          height: 1.1,
          color: deepGreen,
          fontWeight: FontWeight.w800,
        ),
      ),
      const SizedBox(height: 3),
      Text(
        'Explore constitutional milestones, county boundaries, and public records for $county.',
        style: const TextStyle(fontSize: 14, color: muted, height: 1.3),
      ),
    ],
  );

  Widget _searchBar() => Container(
    height: 34,
    padding: const EdgeInsets.symmetric(horizontal: 9),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: line),
    ),
    child: Row(
      children: [
        const Icon(Icons.search, size: 14, color: forest),
        const SizedBox(width: 5),
        Expanded(
          child: TextField(
            controller: search,
            focusNode: searchFocus,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(fontSize: 12.5),
            decoration: const InputDecoration(
              border: InputBorder.none,
              isDense: true,
              hintText: 'Search historical records, dates, or institutions…',
              hintStyle: TextStyle(fontSize: 12.5, color: muted),
            ),
          ),
        ),
        if (search.text.isNotEmpty)
          InkWell(
            onTap: () {
              search.clear();
              setState(() {});
            },
            child: const Icon(Icons.cancel_outlined, size: 14, color: muted),
          ),
      ],
    ),
  );

  Widget _countyCard() => Container(
    padding: const EdgeInsets.all(10),
    decoration: BoxDecoration(
      color: const Color(0xFFEAF3EC),
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(
      children: [
        Container(
          width: 35,
          height: 35,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(9),
          ),
          child: const Icon(Icons.location_city, color: forest, size: 19),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                county.toUpperCase(),
                style: const TextStyle(
                  fontSize: 10.5,
                  letterSpacing: .3,
                  color: forest,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const Text(
                'County code 032 • Rift Valley Region',
                style: TextStyle(fontSize: 12.5, color: ink),
              ),
              const Text(
                'Boundary record follows the 2010 Constitution',
                style: TextStyle(fontSize: 11, color: muted),
              ),
            ],
          ),
        ),
        _pill('47 Counties', const Color(0xFFD6F3E2), forest),
      ],
    ),
  );

  Widget _eraFilters() => SizedBox(
    height: 28,
    child: ListView(
      scrollDirection: Axis.horizontal,
      children:
          [
            'All Eras',
            'Colonial',
            'Republic',
            'Devolution',
            'County Records',
          ].map((item) {
            final selected =
                era ==
                (item == 'Colonial'
                    ? 'COLONIAL PERIOD'
                    : item == 'Republic'
                    ? 'REPUBLIC'
                    : item == 'Devolution'
                    ? 'DEVOLUTION'
                    : item == 'County Records'
                    ? 'COUNTY RECORD'
                    : 'All Eras');
            return Padding(
              padding: const EdgeInsets.only(right: 5),
              child: ChoiceChip(
                label: Text(
                  item,
                  style: TextStyle(
                    fontSize: 11.5,
                    color: selected ? Colors.white : ink,
                  ),
                ),
                selected: selected,
                onSelected: (_) => setState(
                  () => era = item == 'Colonial'
                      ? 'COLONIAL PERIOD'
                      : item == 'Republic'
                      ? 'REPUBLIC'
                      : item == 'Devolution'
                      ? 'DEVOLUTION'
                      : item == 'County Records'
                      ? 'COUNTY RECORD'
                      : 'All Eras',
                ),
                selectedColor: deepGreen,
                backgroundColor: const Color(0xFFE7EEE8),
                side: BorderSide.none,
                showCheckmark: false,
                visualDensity: VisualDensity.compact,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 0),
              ),
            );
          }).toList(),
    ),
  );

  Widget _timeline() {
    final query = search.text.toLowerCase();
    final filtered = events
        .where(
          (e) =>
              (era == 'All Eras' || e.category == era) &&
              ('${e.year} ${e.title} ${e.description} ${e.source}'
                  .toLowerCase()
                  .contains(query)),
        )
        .toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Expanded(
              child: Text(
                'HISTORICAL MILESTONES',
                style: TextStyle(
                  fontSize: 11.5,
                  letterSpacing: .3,
                  color: muted,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Text(
              '${filtered.length} records',
              style: const TextStyle(fontSize: 11, color: muted),
            ),
          ],
        ),
        const SizedBox(height: 7),
        if (filtered.isEmpty)
          _empty('No timeline records match this search.')
        else
          ...filtered.asMap().entries.map(
            (entry) => _timelineTile(
              entry.value,
              last: entry.key == filtered.length - 1,
            ),
          ),
      ],
    );
  }

  Widget _timelineTile(_HistoryEvent event, {required bool last}) => InkWell(
    onTap: () => detail(event.title, event.description, event.source),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 55,
          child: Column(
            children: [
              Container(
                width: 47,
                padding: const EdgeInsets.symmetric(vertical: 5),
                decoration: BoxDecoration(
                  color: event.category == 'DEVOLUTION'
                      ? deepGreen
                      : const Color(0xFFE0EBE2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  event.year,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11.5,
                    color: event.category == 'DEVOLUTION'
                        ? Colors.white
                        : deepGreen,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              if (!last)
                Container(width: 1, height: 73, color: const Color(0xFFC8D8CC)),
            ],
          ),
        ),
        const SizedBox(width: 5),
        Expanded(
          child: Container(
            margin: const EdgeInsets.only(bottom: 7),
            padding: const EdgeInsets.all(9),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: const Color(0xFFE5ECE6)),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.category,
                  style: const TextStyle(
                    fontSize: 10.5,
                    letterSpacing: .35,
                    color: forest,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  event.title,
                  style: const TextStyle(
                    fontSize: 12.5,
                    color: ink,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  event.description,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: muted,
                    height: 1.25,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.source_outlined, size: 9, color: forest),
                    const SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        event.source,
                        style: const TextStyle(fontSize: 10.5, color: forest),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const Icon(Icons.chevron_right, size: 13, color: muted),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    ),
  );

  Widget _boundaryCard() => Container(
    padding: const EdgeInsets.all(10),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: const Color(0xFFE5ECE6)),
      borderRadius: BorderRadius.circular(11),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.map_outlined, size: 15, color: forest),
            const SizedBox(width: 5),
            const Expanded(
              child: Text(
                'County Boundaries & Devolution',
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: ink,
                ),
              ),
            ),
            _pill('2010 →', const Color(0xFFE4F0E7), forest),
          ],
        ),
        const SizedBox(height: 5),
        const Text(
          'The First Schedule to the Constitution lists Kenya’s 47 counties. Nakuru County (032) is part of the former Rift Valley Province.',
          style: TextStyle(fontSize: 11, color: muted, height: 1.3),
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Expanded(child: _stat('47', 'Constitutional counties')),
            const SizedBox(width: 5),
            Expanded(child: _stat('032', 'Nakuru county code')),
            const SizedBox(width: 5),
            Expanded(child: _stat('2013', 'First county government')),
          ],
        ),
        const SizedBox(height: 6),
        InkWell(
          onTap: () => detail(
            'County boundary record',
            'Nakuru County is identified as county number 032 in the First Schedule to the Constitution of Kenya.',
            'Constitution of Kenya (2010), First Schedule',
          ),
          child: const Text(
            'Open boundary references  ↗',
            style: TextStyle(
              fontSize: 11,
              color: forest,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ],
    ),
  );

  Widget _recordSection() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text(
        'OFFICIAL RECORDS & CITATIONS',
        style: TextStyle(
          fontSize: 11.5,
          letterSpacing: .35,
          color: forest,
          fontWeight: FontWeight.w700,
        ),
      ),
      const SizedBox(height: 5),
      _record(
        Icons.description_outlined,
        'Constitution of Kenya (2010)',
        'First Schedule • County names and boundaries',
        'KENYA LAW',
      ),
      _record(
        Icons.account_balance_outlined,
        'Nakuru CIDP (2023–2027)',
        'County Integrated Development Plan',
        'NAKURU COUNTY',
      ),
      _record(
        Icons.inventory_2_outlined,
        'Kenya Gazette Archive',
        'Statutory notices and historical instruments',
        'KENYA NATIONAL ARCHIVES',
      ),
    ],
  );

  Widget _record(
    IconData icon,
    String title,
    String detailText,
    String source,
  ) => InkWell(
    onTap: () => detail(title, detailText, source),
    child: Container(
      margin: const EdgeInsets.only(bottom: 5),
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE5ECE6)),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Row(
        children: [
          Container(
            width: 27,
            height: 27,
            decoration: BoxDecoration(
              color: const Color(0xFFEAF2EB),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(icon, size: 15, color: forest),
          ),
          const SizedBox(width: 7),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: ink,
                  ),
                ),
                Text(
                  detailText,
                  style: const TextStyle(fontSize: 10.5, color: muted),
                ),
                Text(
                  source,
                  style: const TextStyle(
                    fontSize: 10.5,
                    color: forest,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.open_in_new, size: 12, color: muted),
        ],
      ),
    ),
  );

  Widget _sourceNote() => Container(
    padding: const EdgeInsets.all(9),
    decoration: BoxDecoration(
      color: const Color(0xFFE9F0EA),
      borderRadius: BorderRadius.circular(10),
    ),
    child: const Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.verified_outlined, size: 14, color: forest),
        SizedBox(width: 6),
        Expanded(
          child: Text(
            'Historical summaries are editorial guides. Confirm dates and legal effect in the cited gazette, archive, or statute.',
            style: TextStyle(fontSize: 11, color: muted, height: 1.3),
          ),
        ),
      ],
    ),
  );

  Widget _stat(String value, String label) => Container(
    padding: const EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: const Color(0xFFF0F5F0),
      borderRadius: BorderRadius.circular(7),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 14.5,
            color: forest,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(label, style: const TextStyle(fontSize: 10.5, color: muted)),
      ],
    ),
  );
  Widget _pill(String text, Color bg, Color fg) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Text(
      text,
      style: TextStyle(fontSize: 10.5, color: fg, fontWeight: FontWeight.w700),
    ),
  );
  Widget _empty(String text) => Container(
    padding: const EdgeInsets.all(15),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Text(text, style: const TextStyle(fontSize: 12.5, color: muted)),
  );

  Widget _bottomNav() => Container(
    decoration: const BoxDecoration(
      color: Color(0xFFFAFCFA),
      border: Border(top: BorderSide(color: line)),
    ),
    padding: EdgeInsets.only(
      top: 5,
      bottom: MediaQuery.of(context).padding.bottom > 0
          ? MediaQuery.of(context).padding.bottom
          : 7,
    ),
    child: Row(
      children: [
        _nav(0, Icons.home_outlined, 'Home'),
        _nav(1, Icons.explore_outlined, 'Explore'),
        _nav(2, Icons.account_balance_wallet_outlined, 'Money'),
        _nav(3, Icons.history, 'History'),
        _nav(4, Icons.bookmark_border, 'Saved'),
      ],
    ),
  );
  Widget _nav(int i, IconData icon, String label) => Expanded(
    child: InkWell(
      onTap: () {
        if (i == 4)
          widget.onNavigate?.call(i);
        else if (i != 3)
          widget.onNavigate?.call(i);
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 17, color: i == 3 ? forest : muted),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.5,
              color: i == 3 ? forest : muted,
              fontWeight: i == 3 ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
        ],
      ),
    ),
  );
}

class _HistoryEvent {
  const _HistoryEvent(
    this.year,
    this.title,
    this.description,
    this.category,
    this.source,
  );
  final String year, title, description, category, source;
}
