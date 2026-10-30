import 'package:flutter/material.dart';

import '../data/geography_api.dart';
import '../data/saved_library.dart';
import '../theme/app_colors.dart';
import '../widgets/cinematic_globe_map.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, this.onNavigate});

  final ValueChanged<int>? onNavigate;
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  GeographyEntity? selectedPlace;
  int nav = 0;
  final searchController = TextEditingController();
  final scroll = ScrollController();
  void notice(String title, String body, {List<String> options = const []}) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 26),
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
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              const SizedBox(height: 18),
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
                style: const TextStyle(
                  fontSize: 17,
                  height: 1.45,
                  color: muted,
                ),
              ),
              if (options.isNotEmpty) ...[
                const SizedBox(height: 14),
                ...options.map(
                  (o) => ListTile(
                    dense: true,
                    leading: const Icon(Icons.layers_outlined, color: forest),
                    title: Text(o),
                    onTap: () => Navigator.pop(ctx),
                  ),
                ),
              ],
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
  }

  Future<void> chooseLocation() async {
    final queryController = TextEditingController();
    List<GeographyEntity> results = const [];
    bool loading = false;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setSheetState) => SafeArea(
          child: Padding(
            padding: EdgeInsets.fromLTRB(
              16,
              16,
              16,
              16 + MediaQuery.viewInsetsOf(context).bottom,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Find a county, constituency, or ward',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 21.5),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: queryController,
                  autofocus: true,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Country, county, constituency, or ward',
                    suffixIcon: loading
                        ? const Padding(
                            padding: EdgeInsets.all(12),
                            child: SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          )
                        : IconButton(
                            icon: const Icon(Icons.search),
                            onPressed: () async {
                              setSheetState(() => loading = true);
                              try {
                                results = await GeographyApiClient.instance
                                    .search(queryController.text);
                              } catch (_) {
                                results = const [];
                              }
                              if (context.mounted) {
                                setSheetState(() => loading = false);
                              }
                            },
                          ),
                  ),
                  onSubmitted: (_) async {
                    setSheetState(() => loading = true);
                    try {
                      results = await GeographyApiClient.instance.search(
                        queryController.text,
                      );
                    } catch (_) {
                      results = const [];
                    }
                    if (context.mounted) setSheetState(() => loading = false);
                  },
                ),
                if (results.isNotEmpty)
                  Flexible(
                    child: ListView(
                      shrinkWrap: true,
                      children: results
                          .map(
                            (place) => ListTile(
                              leading: const Icon(
                                Icons.place_outlined,
                                color: forest,
                              ),
                              title: Text(place.name),
                              subtitle: Text(
                                place.displayName,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              onTap: () {
                                setState(() {
                                  selectedPlace = place;
                                });
                                Navigator.pop(sheetContext);
                              },
                            ),
                          )
                          .toList(),
                    ),
                  ),
                if (!loading &&
                    results.isEmpty &&
                    queryController.text.isNotEmpty)
                  const Padding(
                    padding: EdgeInsets.all(10),
                    child: Text(
                      'No matches yet. Submit a place name to search.',
                      style: TextStyle(color: muted, fontSize: 16),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
    queryController.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: CustomScrollView(
              controller: scroll,
              slivers: [
                SliverToBoxAdapter(child: _search()),
                SliverToBoxAdapter(child: _filters()),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 16),
                  sliver: SliverList.list(
                    children: [
                      _mapCard(),
                      const SizedBox(height: 14),
                      _architecture(),
                      const SizedBox(height: 15),
                      _briefings(),
                      const SizedBox(height: 15),
                      _records(),
                      const SizedBox(height: 12),
                      _continueCard(),
                      const SizedBox(height: 16),
                      _sources(),
                      const SizedBox(height: 16),
                      _footer(),
                      const SizedBox(height: 18),
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
    padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
    decoration: const BoxDecoration(
      color: Color(0xFFF6FAF6),
      border: Border(bottom: BorderSide(color: line)),
    ),
    child: Row(
      children: [
        Container(
          width: 29,
          height: 29,
          decoration: BoxDecoration(
            color: pale,
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(
            Icons.account_balance_outlined,
            color: forest,
            size: 18,
          ),
        ),
        const SizedBox(width: 7),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: deepGreen,
                  height: 1.1,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(fontSize: 11, letterSpacing: .3, color: muted),
              ),
            ],
          ),
        ),
        InkWell(
          onTap: chooseLocation,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: line),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Icon(Icons.location_on, size: 11, color: forest),
                SizedBox(width: 3),
                Text(
                  selectedPlace?.name ?? 'Choose location',
                  style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
                ),
                Icon(Icons.keyboard_arrow_down, size: 13),
              ],
            ),
          ),
        ),
        IconButton(
          onPressed: () => notice(
            'Search Mzizi',
            'Search counties, public projects, budgets, and official records.',
          ),
          icon: const Icon(Icons.search, size: 20),
          visualDensity: VisualDensity.compact,
        ),
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: const Color(0xFFB7CFBF),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Icon(Icons.person, size: 16, color: deepGreen),
        ),
      ],
    ),
  );
  Widget _search() => Padding(
    padding: const EdgeInsets.fromLTRB(10, 7, 10, 3),
    child: Row(
      children: [
        Expanded(
          child: Container(
            height: 31,
            padding: const EdgeInsets.symmetric(horizontal: 9),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: line),
              borderRadius: BorderRadius.circular(9),
            ),
            child: Row(
              children: [
                const Icon(Icons.search, size: 16, color: forest),
                const SizedBox(width: 6),
                Expanded(
                  child: TextField(
                    controller: searchController,
                    style: const TextStyle(fontSize: 13),
                    decoration: const InputDecoration(
                      hintText: 'Search Kilimani projects, Nairobi budget…',
                      hintStyle: TextStyle(fontSize: 13, color: muted),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                    onSubmitted: (s) => notice(
                      'Search results',
                      s.isEmpty
                          ? 'Enter a topic to search.'
                          : 'Illustrative results for “$s”.',
                    ),
                  ),
                ),
                InkWell(
                  onTap: () => notice(
                    'Search results',
                    searchController.text.isEmpty
                        ? 'Enter a topic to search.'
                        : 'Illustrative results for “${searchController.text}”.',
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: pale,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.touch_app, size: 10, color: forest),
                        Text(
                          ' Tap',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: forest,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    ),
  );
  Widget _filters() => SizedBox(
    height: 29,
    child: ListView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      children: [
        _chip('● VERIFIED LOCAL EVIDENCE', active: true),
        _chip('⌖ NAIROBI 047'),
        _chip('◉ Kilimani Ward', active: true),
        _chip('▤ Dagoretti North NG-CDF'),
        _chip('⌖ Nairobi'),
      ],
    ),
  );
  Widget _chip(String label, {bool active = false}) => Container(
    margin: const EdgeInsets.only(right: 5),
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(
      color: active ? forest : const Color(0xFFEAF1EB),
      borderRadius: BorderRadius.circular(16),
    ),
    child: Text(
      label,
      style: TextStyle(
        color: active ? Colors.white : muted,
        fontSize: 11.5,
        fontWeight: FontWeight.w700,
      ),
    ),
  );

  Widget _mapCard() => Container(
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: line),
      borderRadius: BorderRadius.circular(12),
    ),
    clipBehavior: Clip.antiAlias,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          color: const Color(0xFFF1F7F2),
          padding: const EdgeInsets.fromLTRB(10, 9, 10, 7),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.map_outlined, color: forest, size: 14),
                  const SizedBox(width: 5),
                  const Expanded(
                    child: Text(
                      'KENYA LOCATIONS MAP',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w800,
                        color: forest,
                        letterSpacing: .3,
                      ),
                    ),
                  ),
                  _badge('3D political globe', bg: pale),
                ],
              ),
              const SizedBox(height: 7),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          selectedPlace?.name ?? 'Select a location',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: ink,
                          ),
                        ),
                        Text(
                          selectedPlace?.displayName ??
                              'Search for a place in Kenya.',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12.5, color: ink),
                        ),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: chooseLocation,
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size(48, 22),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text(
                      'Change⌄',
                      style: TextStyle(fontSize: 12.5, color: forest),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        SizedBox(
          height: 130,
          child: CinematicGlobeMap(
            selectedPlace: selectedPlace,
            height: 130,
            onPlaceSelected: (place) => setState(() => selectedPlace = place),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(7, 0, 7, 5),
          child: Row(
            children: [
              _badge(
                '● ${selectedPlace?.name ?? 'No location selected'}',
                bg: pale,
                color: forest,
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(9, 3, 9, 4),
          child: Row(
            children: [
              const Expanded(
                child: Text(
                  'SELECT WARD TO INSPECT:',
                  style: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                    color: muted,
                  ),
                ),
              ),
              TextButton(
                onPressed: chooseLocation,
                child: const Text(
                  'Search locations',
                  style: TextStyle(fontSize: 12.5),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 36,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            children: [
              ActionChip(
                label: Text(
                  selectedPlace?.name ?? 'Find a place',
                  style: const TextStyle(fontSize: 12.5),
                ),
                avatar: const Icon(Icons.search, size: 13),
                onPressed: chooseLocation,
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 4, 8, 8),
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => notice(
                    'Map layers',
                    'Choose data layers to display on the constituency map.',
                    options: [
                      'Ward boundaries',
                      'Public projects',
                      'Budget allocations',
                      'Audits',
                    ],
                  ),
                  icon: const Icon(Icons.layers_outlined, size: 13),
                  label: const Text(
                    'Explore Map Layers',
                    style: TextStyle(fontSize: 12.5),
                  ),
                  style: _primaryButton(),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => notice(
                    'NG-CDF Ledger',
                    'Illustrative NG-CDF allocations and project records for Dagoretti North.',
                  ),
                  icon: const Icon(Icons.description_outlined, size: 13),
                  label: const Text(
                    'NG-CDF Ledger',
                    style: TextStyle(fontSize: 12.5),
                  ),
                  style: _outlineButton(),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
  ButtonStyle _primaryButton() => ElevatedButton.styleFrom(
    backgroundColor: forest,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 7),
    minimumSize: const Size(0, 31),
    visualDensity: VisualDensity.compact,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );
  ButtonStyle _outlineButton() => OutlinedButton.styleFrom(
    backgroundColor: const Color(0xFFF7FAF7),
    foregroundColor: ink,
    side: const BorderSide(color: line),
    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 7),
    minimumSize: const Size(0, 31),
    visualDensity: VisualDensity.compact,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  );
  Widget _sectionTitle(
    String title, {
    String? trailing,
    String? eyebrow,
    VoidCallback? onTap,
  }) => Padding(
    padding: const EdgeInsets.fromLTRB(1, 0, 1, 7),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (eyebrow != null)
                Text(
                  eyebrow,
                  style: const TextStyle(
                    fontSize: 11,
                    letterSpacing: .4,
                    color: muted,
                  ),
                ),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: ink,
                  height: 1.25,
                ),
              ),
            ],
          ),
        ),
        if (trailing != null)
          InkWell(
            onTap: onTap,
            child: Text(
              trailing,
              style: const TextStyle(
                fontSize: 11.5,
                color: forest,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
      ],
    ),
  );
  Widget _architecture() => Column(
    children: [
      _sectionTitle('Civic Architecture', trailing: 'NAIROBI 047 PORTALS'),
      GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 5,
        crossAxisSpacing: 5,
        childAspectRatio: 1.55,
        children: [
          _arch(
            Icons.map_outlined,
            '01',
            'Explore Kenya',
            '47 devolved counties & administrative wards.',
          ),
          _arch(
            Icons.account_balance_outlined,
            '02',
            'State Organs',
            'Executive, Parliament, COB, EACC & OAG.',
          ),
          _arch(
            Icons.account_balance_wallet_outlined,
            '03',
            'Public Money',
            'FY 2024/25 budgets, tenders & ward audits.',
          ),
          _arch(
            Icons.menu_book_outlined,
            '04',
            'Civic History',
            '1895–present treaties, boundaries & 2010 law.',
          ),
        ],
      ),
    ],
  );
  Widget _arch(IconData icon, String n, String title, String desc) => InkWell(
    onTap: () => notice(title, desc),
    child: Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: line),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _iconBox(icon),
              const Spacer(),
              Text(n, style: const TextStyle(fontSize: 10.5, color: muted)),
            ],
          ),
          const Spacer(),
          Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: ink,
            ),
          ),
          Text(
            desc,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 11.5, color: muted, height: 1.25),
          ),
        ],
      ),
    ),
  );
  Widget _iconBox(IconData icon) => Container(
    width: 22,
    height: 22,
    decoration: BoxDecoration(
      color: pale,
      borderRadius: BorderRadius.circular(6),
    ),
    child: Icon(icon, size: 13, color: forest),
  );

  Widget _briefings() => Column(
    children: [
      _sectionTitle(
        'Understand the Issue',
        eyebrow: 'PLAIN LANGUAGE BRIEFINGS',
        trailing: 'All (18) ›',
        onTap: () =>
            notice('Briefings', 'Browse plain-language civic explainers.'),
      ),
      _article(
        0,
        'Budget Primer',
        '4 min read',
        'How the Equitable Share Formula Works (and why county disbursements stall)',
        'Why healthcare workers strike in October while the CRA formula remains mandatory.',
        'Article #47-EQ',
        'account_balance',
      ),
      const SizedBox(height: 5),
      _article(
        1,
        'Devolution 101',
        '3 min read',
        'County Assembly vs. County Executive: Who Approves Your Ward Project?',
        'Separating the oversight mandate of your Member of County Assembly.',
        'Article #12-OVS',
        'groups',
      ),
    ],
  );
  Widget _article(
    int id,
    String tag,
    String time,
    String title,
    String desc,
    String ref,
    String image,
  ) => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: line),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            _badge(
              tag,
              bg: id == 0 ? const Color(0xFFF7E8C8) : pale,
              color: id == 0 ? const Color(0xFF875B1B) : forest,
            ),
            const SizedBox(width: 5),
            const Icon(Icons.schedule, size: 10, color: muted),
            const SizedBox(width: 3),
            Text(time, style: const TextStyle(fontSize: 11, color: muted)),
            const Spacer(),
            InkWell(
              onTap: () => setState(
                () => SavedLibrary.instance.toggle(
                  SavedEntry(
                    id: 'briefing_$id',
                    title: title,
                    type: 'Briefing',
                    description: desc,
                    reference: ref,
                  ),
                ),
              ),
              child: Icon(
                SavedLibrary.instance.contains('briefing_$id')
                    ? Icons.bookmark
                    : Icons.bookmark_border,
                size: 16,
                color: SavedLibrary.instance.contains('briefing_$id')
                    ? forest
                    : muted,
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                      color: ink,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 11.5,
                      color: muted,
                      height: 1.2,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 7),
            Container(
              width: 48,
              height: 43,
              decoration: BoxDecoration(
                color: id == 0
                    ? const Color(0xFFECE8D7)
                    : const Color(0xFFDCE9DF),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Icon(
                id == 0
                    ? Icons.account_balance
                    : image == 'groups'
                    ? Icons.groups
                    : Icons.account_balance_outlined,
                color: forest,
                size: 24,
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            Text(ref, style: const TextStyle(fontSize: 10.5, color: muted)),
            const Spacer(),
            const Text(
              'Read Briefing →',
              style: TextStyle(
                fontSize: 11.5,
                color: forest,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _records() => Column(
    children: [
      _sectionTitle('Recently Added Records', trailing: '▤ Automated\nIngest'),
      _record(
        Icons.flag_outlined,
        'Office of the Auditor General',
        '14 Nov 2024',
        'Auditor General Report FY 2023/24: Nairobi City County Infrastructure Fund',
        'Ref: OAG/NCC/2024/VOL.IV',
        'Audit Ledger (PDF)',
        true,
      ),
      const SizedBox(height: 5),
      _record(
        Icons.verified_outlined,
        'National Treasury Gazette',
        '08 Nov 2024',
        'National Treasury Quarterly Economic & Budget Review (QEBR Q1)',
        'Ref: TNT/QEBR/Q1-24/25',
        'View Gazette',
        false,
      ),
    ],
  );
  Widget _record(
    IconData icon,
    String org,
    String date,
    String title,
    String ref,
    String action,
    bool red,
  ) => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: line),
      borderRadius: BorderRadius.circular(9),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 13, color: red ? const Color(0xFFC94A45) : forest),
            const SizedBox(width: 5),
            _badge(
              org,
              bg: red ? const Color(0xFFFCEDEC) : const Color(0xFFE9F2EB),
              color: red ? const Color(0xFFC94A45) : muted,
            ),
            const Spacer(),
            Text(date, style: const TextStyle(fontSize: 11, color: muted)),
          ],
        ),
        const SizedBox(height: 5),
        Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            height: 1.2,
            color: ink,
          ),
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            Text(ref, style: const TextStyle(fontSize: 10.5, color: muted)),
            const Spacer(),
            InkWell(
              onTap: () => notice(
                action,
                'Sample source record. Open the originating institution portal to verify publication details.',
              ),
              child: Text(
                '$action ↗',
                style: const TextStyle(
                  fontSize: 11,
                  color: forest,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _continueCard() => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: const Color(0xFFEEF5EF),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      children: [
        Row(
          children: [
            const Icon(Icons.history, size: 12, color: muted),
            const SizedBox(width: 4),
            const Expanded(
              child: Text(
                'CONTINUE EXPLORING',
                style: TextStyle(
                  fontSize: 11,
                  color: muted,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            _badge('78% Verified', bg: pale, color: forest),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            Container(
              width: 48,
              height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFFD8E7DC),
                borderRadius: BorderRadius.circular(5),
              ),
              child: const Icon(Icons.landscape_outlined, color: forest),
            ),
            const SizedBox(width: 7),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Nakuru County: Housing P…',
                    maxLines: 1,
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                  Text(
                    '14 tender contracts audited • Ward 032',
                    style: TextStyle(fontSize: 11, color: muted),
                  ),
                  SizedBox(height: 5),
                  LinearProgressIndicator(
                    value: .78,
                    minHeight: 3,
                    backgroundColor: line,
                    color: forest,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 6),
            InkWell(
              onTap: () => notice(
                'Continue exploring',
                'Nakuru County housing projects • Ward 032. Evidence coverage: 78%.',
              ),
              child: const CircleAvatar(
                radius: 12,
                backgroundColor: Colors.white,
                child: Icon(Icons.arrow_forward, color: forest, size: 15),
              ),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _sources() => Column(
    children: [
      _sectionTitle(
        'Official Sources & Provenance',
        eyebrow: 'INSTITUTIONAL TRUST & AUDITS',
        trailing: '◉ 100%\nStatutory',
      ),
      _source(
        Icons.account_balance_outlined,
        'Commission on Revenue Allocation (CRA)',
        'County Revenue Allocation Formula, equitable share disbursement schedules, and gazetted fiscal baselines.',
        'Cycle: FY 2024/25 • Updated Nov 2024',
        'CRA Portal ↗',
        'Verified Statutory',
      ),
      const SizedBox(height: 5),
      _source(
        Icons.gavel_outlined,
        'Office of the Auditor-General (OAG)',
        'National & County annual audit ledgers, qualified opinions, forensic reports, and special inquiry filings.',
        '47 Counties Indexed • Vol. I–IV',
        'OAG Reports ↗',
        'Verified Statutory',
      ),
      const SizedBox(height: 5),
      _source(
        Icons.account_balance_wallet_outlined,
        'National Treasury & Planning',
        'Quarterly Economic and Budget Review (QEBR), IFMIS expenditure transfers, and public debt bulletins.',
        'Quarterly Ingest • Q1 FY 2024/25',
        'Treasury Portal ↗',
        'Verified Statutory',
      ),
      const SizedBox(height: 5),
      _source(
        Icons.bar_chart,
        'KNBS & Demographic Census',
        'Kenya National Bureau of Statistics 2019 Census, sub-county population density, and poverty index measures.',
        'KNBS Volume I–IV Projections',
        'KNBS Data ↗',
        'Official Baseline',
      ),
      const SizedBox(height: 5),
      _source(
        Icons.dataset_outlined,
        'PPIP & Kenya Open Data (KODI)',
        'Public Procurement Information Portal ward-level tender award notices, contractor registers, and geospatial points.',
        'Daily Tenders • 47 County Portals',
        'PPIP Portal ↗',
        'Live Feed',
      ),
    ],
  );
  Widget _source(
    IconData icon,
    String name,
    String desc,
    String meta,
    String action,
    String badge,
  ) => Container(
    padding: const EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: line),
      borderRadius: BorderRadius.circular(9),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 14, color: forest),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                name,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  height: 1.2,
                  color: ink,
                ),
              ),
            ),
            const SizedBox(width: 4),
            _badge(
              badge,
              bg: badge == 'Live Feed'
                  ? const Color(0xFFD9F5E5)
                  : badge == 'Official Baseline'
                  ? const Color(0xFFECEFED)
                  : const Color(0xFFD9F5E5),
              color: badge == 'Official Baseline' ? muted : forest,
            ),
          ],
        ),
        const SizedBox(height: 4),
        Padding(
          padding: const EdgeInsets.only(left: 20),
          child: Text(
            desc,
            style: const TextStyle(fontSize: 11, color: muted, height: 1.25),
          ),
        ),
        const SizedBox(height: 5),
        Padding(
          padding: const EdgeInsets.only(left: 20),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  meta,
                  style: const TextStyle(fontSize: 10.5, color: muted),
                ),
              ),
              InkWell(
                onTap: () => notice(
                  action,
                  'Institutional source link. Confirm current records with the source institution.',
                ),
                child: Text(
                  action,
                  style: const TextStyle(
                    fontSize: 11,
                    color: forest,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
  Widget _footer() => Container(
    width: double.infinity,
    padding: const EdgeInsets.fromLTRB(10, 10, 10, 5),
    decoration: const BoxDecoration(
      border: Border(top: BorderSide(color: line)),
    ),
    child: Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.storage_outlined, size: 10, color: muted),
            const SizedBox(width: 4),
            const Text(
              'PUBLIC RESEARCH ENGINE',
              style: TextStyle(fontSize: 10.5, color: muted, letterSpacing: .3),
            ),
          ],
        ),
        const SizedBox(height: 5),
        const Text(
          'All data displayed is for civic illustration and research purposes. Verify with the Kenya Open Data Initiative principles.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 10.5, color: muted, height: 1.3),
        ),
      ],
    ),
  );
  Widget _badge(String text, {required Color bg, Color color = muted}) =>
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 10.5,
            color: color,
            fontWeight: FontWeight.w600,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
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
      children: List.generate(5, (i) {
        final icons = [
          Icons.home_outlined,
          Icons.explore_outlined,
          Icons.account_balance_wallet_outlined,
          Icons.history,
          Icons.bookmark_border,
        ];
        final labels = ['Home', 'Explore', 'Money', 'History', 'Saved'];
        return Expanded(
          child: InkWell(
            onTap: () {
              setState(() => nav = i);
              if (i > 0) {
                widget.onNavigate?.call(i);
              }
            },
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icons[i], size: 17, color: nav == i ? forest : muted),
                const SizedBox(height: 2),
                Text(
                  labels[i],
                  style: TextStyle(
                    fontSize: 10.5,
                    color: nav == i ? forest : muted,
                    fontWeight: nav == i ? FontWeight.w700 : FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
        );
      }),
    ),
  );
}
