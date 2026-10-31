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
    const _HistoryEvent(
      '1895',
      'Protectorate administration begins',
      'The British East Africa Protectorate is established. The region that later becomes Kenya is administered as a protectorate.',
      'COLONIAL PERIOD',
      'East Africa Protectorate records',
    ),
    const _HistoryEvent(
      '1920',
      'Kenya Colony proclaimed',
      'The territory is formally designated the Kenya Colony, with changing administrative districts and boundaries.',
      'COLONIAL PERIOD',
      'Kenya Colony Gazette notices',
    ),
    const _HistoryEvent(
      '1963',
      'Independence and self-government',
      'Kenya attains independence. Provincial and district administration continues through the early republic.',
      'REPUBLIC',
      'Independence instruments • Kenya National Archives',
    ),
    const _HistoryEvent(
      '2010',
      'Constitution establishes 47 counties',
      'The Constitution introduces devolved government and lists the county boundaries and names in the First Schedule.',
      'DEVOLUTION',
      'Constitution of Kenya • First Schedule',
    ),
    const _HistoryEvent(
      '2013',
      'County governments take office',
      'The first county administrations are established following the March 2013 general election.',
      'DEVOLUTION',
      'Transition Authority • County handover reports',
    ),
    const _HistoryEvent(
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

  void detail(String title, String body, String source) =>
      showModalBottomSheet<void>(
        context: context,
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (ctx) => SafeArea(
          child: Padding(
            padding: EdgeInsets.fromLTRB(18, 18, 18, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: context.colors.outlineVariant,
                      borderRadius: BorderRadius.circular(5),
                    ),
                  ),
                ),
                SizedBox(height: 17),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 22.5,
                    fontWeight: FontWeight.w800,
                    color: context.colors.onSurface,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  body,
                  style: TextStyle(
                    fontSize: 17,
                    height: 1.4,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
                SizedBox(height: 12),
                Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: context.colors.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.source_outlined,
                        size: 16,
                        color: context.colors.primary,
                      ),
                      SizedBox(width: 7),
                      Expanded(
                        child: Text(
                          source,
                          style: TextStyle(
                            fontSize: 14.5,
                            color: context.colors.onSurface,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: Text('Close'),
                  ),
                ),
              ],
            ),
          ),
        ),
      );

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: EdgeInsets.fromLTRB(12, 11, 12, 18),
                  sliver: SliverList.list(
                    children: [
                      _intro(),
                      SizedBox(height: 11),
                      _searchBar(),
                      SizedBox(height: 10),
                      _countyCard(),
                      SizedBox(height: 11),
                      _eraFilters(),
                      SizedBox(height: 13),
                      _timeline(),
                      SizedBox(height: 12),
                      _boundaryCard(),
                      SizedBox(height: 12),
                      _recordSection(),
                      SizedBox(height: 12),
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
    padding: EdgeInsets.fromLTRB(12, 7, 12, 7),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      border: Border(bottom: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Row(
      children: [
        Icon(Icons.history_edu, size: 20, color: context.colors.primary),
        SizedBox(width: 7),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontFamily: 'serif',
                  fontSize: 14.5,
                  fontWeight: FontWeight.w800,
                  color: context.colors.primary,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.onSurfaceVariant,
                ),
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
              Icon(
                Icons.location_on_outlined,
                size: 12,
                color: context.colors.primary,
              ),
              Text(
                county,
                style: TextStyle(
                  fontSize: 11.5,
                  color: context.colors.onSurface,
                ),
              ),
              Icon(Icons.keyboard_arrow_down, size: 13),
            ],
          ),
        ),
        IconButton(
          onPressed: searchFocus.requestFocus,
          icon: Icon(Icons.search, size: 18),
          visualDensity: VisualDensity.compact,
        ),
        CircleAvatar(
          radius: 12,
          backgroundColor: context.colors.outline,
          child: Icon(Icons.person, size: 14, color: context.colors.primary),
        ),
      ],
    ),
  );

  Widget _intro() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        children: [
          Icon(
            Icons.account_balance_outlined,
            size: 12,
            color: context.colors.primary,
          ),
          SizedBox(width: 5),
          Text(
            'CIVIC HISTORY & ARCHIVES',
            style: TextStyle(
              fontSize: 11.5,
              letterSpacing: .4,
              color: context.colors.primary,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
      SizedBox(height: 4),
      Text(
        'Kenya’s Civic Timeline',
        style: TextStyle(
          fontFamily: 'serif',
          fontSize: 23.5,
          height: 1.1,
          color: context.colors.primary,
          fontWeight: FontWeight.w800,
        ),
      ),
      SizedBox(height: 3),
      Text(
        'Explore constitutional milestones, county boundaries, and public records for $county.',
        style: TextStyle(
          fontSize: 14,
          color: context.colors.onSurfaceVariant,
          height: 1.3,
        ),
      ),
    ],
  );

  Widget _searchBar() => Container(
    height: 34,
    padding: EdgeInsets.symmetric(horizontal: 9),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Row(
      children: [
        Icon(Icons.search, size: 14, color: context.colors.primary),
        SizedBox(width: 5),
        Expanded(
          child: TextField(
            controller: search,
            focusNode: searchFocus,
            onChanged: (_) => setState(() {}),
            style: TextStyle(fontSize: 12.5),
            decoration: InputDecoration(
              border: InputBorder.none,
              isDense: true,
              hintText: 'Search historical records, dates, or institutions…',
              hintStyle: TextStyle(
                fontSize: 12.5,
                color: context.colors.onSurfaceVariant,
              ),
            ),
          ),
        ),
        if (search.text.isNotEmpty)
          InkWell(
            onTap: () {
              search.clear();
              setState(() {});
            },
            child: Icon(
              Icons.cancel_outlined,
              size: 14,
              color: context.colors.onSurfaceVariant,
            ),
          ),
      ],
    ),
  );

  Widget _countyCard() => Container(
    padding: EdgeInsets.all(10),
    decoration: BoxDecoration(
      color: context.colors.secondaryContainer,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(
      children: [
        Container(
          width: 35,
          height: 35,
          decoration: BoxDecoration(
            color: Theme.of(context).scaffoldBackgroundColor,
            borderRadius: BorderRadius.circular(9),
          ),
          child: Icon(
            Icons.location_city,
            color: context.colors.primary,
            size: 19,
          ),
        ),
        SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                county.toUpperCase(),
                style: TextStyle(
                  fontSize: 10.5,
                  letterSpacing: .3,
                  color: context.colors.primary,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Text(
                'County code 032 • Rift Valley Region',
                style: TextStyle(
                  fontSize: 12.5,
                  color: context.colors.onSurface,
                ),
              ),
              Text(
                'Boundary record follows the 2010 Constitution',
                style: TextStyle(
                  fontSize: 11,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
        _pill(
          '47 Counties',
          context.colors.secondaryContainer,
          context.colors.primary,
        ),
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
              padding: EdgeInsets.only(right: 5),
              child: ChoiceChip(
                label: Text(
                  item,
                  style: TextStyle(
                    fontSize: 11.5,
                    color: selected
                        ? context.colors.onPrimary
                        : context.colors.onSurface,
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
                selectedColor: context.colors.primary,
                backgroundColor: context.colors.outlineVariant,
                side: BorderSide.none,
                showCheckmark: false,
                visualDensity: VisualDensity.compact,
                padding: EdgeInsets.symmetric(horizontal: 6, vertical: 0),
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
            Expanded(
              child: Text(
                'HISTORICAL MILESTONES',
                style: TextStyle(
                  fontSize: 11.5,
                  letterSpacing: .3,
                  color: context.colors.onSurfaceVariant,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Text(
              '${filtered.length} records',
              style: TextStyle(
                fontSize: 11,
                color: context.colors.onSurfaceVariant,
              ),
            ),
          ],
        ),
        SizedBox(height: 7),
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
                padding: EdgeInsets.symmetric(vertical: 5),
                decoration: BoxDecoration(
                  color: event.category == 'DEVOLUTION'
                      ? context.colors.primary
                      : context.colors.secondaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  event.year,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11.5,
                    color: event.category == 'DEVOLUTION'
                        ? context.colors.onPrimary
                        : context.colors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              if (!last)
                Container(
                  width: 1,
                  height: 73,
                  color: context.colors.outlineVariant,
                ),
            ],
          ),
        ),
        SizedBox(width: 5),
        Expanded(
          child: Container(
            margin: EdgeInsets.only(bottom: 7),
            padding: EdgeInsets.all(9),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              border: Border.all(color: context.colors.outlineVariant),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.category,
                  style: TextStyle(
                    fontSize: 10.5,
                    letterSpacing: .35,
                    color: context.colors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  event.title,
                  style: TextStyle(
                    fontSize: 12.5,
                    color: context.colors.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  event.description,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    color: context.colors.onSurfaceVariant,
                    height: 1.25,
                  ),
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      Icons.source_outlined,
                      size: 9,
                      color: context.colors.primary,
                    ),
                    SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        event.source,
                        style: TextStyle(
                          fontSize: 10.5,
                          color: context.colors.primary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Icon(
                      Icons.chevron_right,
                      size: 13,
                      color: context.colors.onSurfaceVariant,
                    ),
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
    padding: EdgeInsets.all(10),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(11),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.map_outlined, size: 15, color: context.colors.primary),
            SizedBox(width: 5),
            Expanded(
              child: Text(
                'County Boundaries & Devolution',
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: context.colors.onSurface,
                ),
              ),
            ),
            _pill(
              '2010 →',
              context.colors.secondaryContainer,
              context.colors.primary,
            ),
          ],
        ),
        SizedBox(height: 5),
        Text(
          'The First Schedule to the Constitution lists Kenya’s 47 counties. Nakuru County (032) is part of the former Rift Valley Province.',
          style: TextStyle(
            fontSize: 11,
            color: context.colors.onSurfaceVariant,
            height: 1.3,
          ),
        ),
        SizedBox(height: 6),
        Row(
          children: [
            Expanded(child: _stat('47', 'Constitutional counties')),
            SizedBox(width: 5),
            Expanded(child: _stat('032', 'Nakuru county code')),
            SizedBox(width: 5),
            Expanded(child: _stat('2013', 'First county government')),
          ],
        ),
        SizedBox(height: 6),
        InkWell(
          onTap: () => detail(
            'County boundary record',
            'Nakuru County is identified as county number 032 in the First Schedule to the Constitution of Kenya.',
            'Constitution of Kenya (2010), First Schedule',
          ),
          child: Text(
            'Open boundary references  ↗',
            style: TextStyle(
              fontSize: 11,
              color: context.colors.primary,
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
      Text(
        'OFFICIAL RECORDS & CITATIONS',
        style: TextStyle(
          fontSize: 11.5,
          letterSpacing: .35,
          color: context.colors.primary,
          fontWeight: FontWeight.w700,
        ),
      ),
      SizedBox(height: 5),
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
      margin: EdgeInsets.only(bottom: 5),
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border.all(color: context.colors.outlineVariant),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Row(
        children: [
          Container(
            width: 27,
            height: 27,
            decoration: BoxDecoration(
              color: context.colors.secondaryContainer,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(icon, size: 15, color: context.colors.primary),
          ),
          SizedBox(width: 7),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: context.colors.onSurface,
                  ),
                ),
                Text(
                  detailText,
                  style: TextStyle(
                    fontSize: 10.5,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
                Text(
                  source,
                  style: TextStyle(
                    fontSize: 10.5,
                    color: context.colors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.open_in_new,
            size: 12,
            color: context.colors.onSurfaceVariant,
          ),
        ],
      ),
    ),
  );

  Widget _sourceNote() => Container(
    padding: EdgeInsets.all(9),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.verified_outlined, size: 14, color: context.colors.primary),
        SizedBox(width: 6),
        Expanded(
          child: Text(
            'Historical summaries are editorial guides. Confirm dates and legal effect in the cited gazette, archive, or statute.',
            style: TextStyle(
              fontSize: 11,
              color: context.colors.onSurfaceVariant,
              height: 1.3,
            ),
          ),
        ),
      ],
    ),
  );

  Widget _stat(String value, String label) => Container(
    padding: EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(7),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 14.5,
            color: context.colors.primary,
            fontWeight: FontWeight.w800,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 10.5,
            color: context.colors.onSurfaceVariant,
          ),
        ),
      ],
    ),
  );
  Widget _pill(String text, Color bg, Color fg) => Container(
    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
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
    padding: EdgeInsets.all(15),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Text(
      text,
      style: TextStyle(fontSize: 12.5, color: context.colors.onSurfaceVariant),
    ),
  );

  Widget _bottomNav() => Container(
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border(top: BorderSide(color: context.colors.outlineVariant)),
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
          Icon(
            icon,
            size: 17,
            color: i == 3
                ? context.colors.primary
                : context.colors.onSurfaceVariant,
          ),
          SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.5,
              color: i == 3
                  ? context.colors.primary
                  : context.colors.onSurfaceVariant,
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
