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
  GeographyScene? selectedScene;
  final searchController = TextEditingController();
  final searchFocus = FocusNode();
  final scroll = ScrollController();

  @override
  void dispose() {
    searchController.dispose();
    searchFocus.dispose();
    scroll.dispose();
    super.dispose();
  }

  void notice(String title, String body, {List<String> options = const []}) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: EdgeInsets.fromLTRB(20, 18, 20, 26),
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
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              SizedBox(height: 18),
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
                  height: 1.45,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
              if (options.isNotEmpty) ...[
                SizedBox(height: 14),
                ...options.map(
                  (o) => ListTile(
                    dense: true,
                    leading: Icon(
                      Icons.layers_outlined,
                      color: context.colors.primary,
                    ),
                    title: Text(o),
                    onTap: () => Navigator.pop(ctx),
                  ),
                ),
              ],
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
  }

  Future<void> chooseLocation({String initialQuery = ''}) async {
    final queryController = TextEditingController();
    queryController.text = initialQuery;
    List<GeographyEntity> results = const [];
    bool loading = false;
    String? error;
    Future<void> searchPlaces(StateSetter setSheetState) async {
      final query = queryController.text.trim();
      if (query.isEmpty || loading) return;
      setSheetState(() {
        loading = true;
        error = null;
        results = const [];
      });
      try {
        results = await GeographyApiClient.instance.search(query);
      } catch (exception) {
        error = exception.toString().replaceFirst('Exception: ', '');
      }
      if (context.mounted) setSheetState(() => loading = false);
    }

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
                Text(
                  'Find a place or administrative area',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 21.5),
                ),
                SizedBox(height: 10),
                TextField(
                  controller: queryController,
                  autofocus: true,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Search by place name',
                    suffixIcon: loading
                        ? Padding(
                            padding: EdgeInsets.all(12),
                            child: SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          )
                        : IconButton(
                            icon: Icon(Icons.search),
                            onPressed: () => searchPlaces(setSheetState),
                          ),
                  ),
                  onSubmitted: (_) => searchPlaces(setSheetState),
                ),
                if (results.isNotEmpty)
                  Flexible(
                    child: ListView(
                      shrinkWrap: true,
                      children: results
                          .map(
                            (place) => ListTile(
                              leading: Icon(
                                Icons.place_outlined,
                                color: context.colors.primary,
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
                                  selectedScene = null;
                                });
                                Navigator.pop(sheetContext);
                              },
                            ),
                          )
                          .toList(),
                    ),
                  ),
                if (!loading && error != null)
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Text(
                      error!,
                      style: TextStyle(color: context.colors.error),
                    ),
                  ),
                if (!loading &&
                    error == null &&
                    results.isEmpty &&
                    queryController.text.isNotEmpty)
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Text(
                      'No matching places were found. Check the spelling or try a broader area.',
                      style: TextStyle(
                        color: context.colors.onSurfaceVariant,
                        fontSize: 16,
                      ),
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

  Future<void> _searchFromHome([String? value]) =>
      chooseLocation(initialQuery: (value ?? searchController.text).trim());

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
                  padding: EdgeInsets.fromLTRB(16, 8, 16, 20),
                  sliver: SliverList.list(
                    children: [
                      _mapCard(),
                      SizedBox(height: 20),
                      _architecture(),
                      SizedBox(height: 15),
                      _briefings(),
                      SizedBox(height: 15),
                      _records(),
                      SizedBox(height: 12),
                      _continueCard(),
                      SizedBox(height: 16),
                      _sources(),
                      SizedBox(height: 16),
                      _footer(),
                      SizedBox(height: 18),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );

  Widget _header() => Container(
    padding: EdgeInsets.fromLTRB(12, 8, 12, 8),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      border: Border(bottom: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Row(
      children: [
        Container(
          width: 29,
          height: 29,
          decoration: BoxDecoration(
            color: context.colors.secondaryContainer,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            Icons.account_balance_outlined,
            color: context.colors.primary,
            size: 18,
          ),
        ),
        SizedBox(width: 7),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontFamily: 'serif',
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: context.colors.primary,
                  height: 1.1,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(
                  fontSize: 11,
                  letterSpacing: .3,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
        InkWell(
          onTap: chooseLocation,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 7, vertical: 5),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              border: Border.all(color: context.colors.outlineVariant),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.location_on,
                  size: 11,
                  color: context.colors.primary,
                ),
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
          onPressed: () => searchFocus.requestFocus(),
          icon: Icon(Icons.search, size: 20),
          visualDensity: VisualDensity.compact,
        ),
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: context.colors.outline,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Icon(Icons.person, size: 16, color: context.colors.primary),
        ),
      ],
    ),
  );
  Widget _search() => Padding(
    padding: EdgeInsets.fromLTRB(10, 7, 10, 3),
    child: Row(
      children: [
        Expanded(
          child: Container(
            height: 31,
            padding: EdgeInsets.symmetric(horizontal: 9),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              border: Border.all(color: context.colors.outlineVariant),
              borderRadius: BorderRadius.circular(9),
            ),
            child: Row(
              children: [
                Icon(Icons.search, size: 16, color: context.colors.primary),
                SizedBox(width: 6),
                Expanded(
                  child: TextField(
                    controller: searchController,
                    focusNode: searchFocus,
                    style: TextStyle(fontSize: 13),
                    textInputAction: TextInputAction.search,
                    decoration: InputDecoration(
                      hintText: 'Search Kilimani projects, Nairobi budget…',
                      hintStyle: TextStyle(
                        fontSize: 13,
                        color: context.colors.onSurfaceVariant,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                    onSubmitted: _searchFromHome,
                  ),
                ),
                InkWell(
                  onTap: _searchFromHome,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(
                      color: context.colors.secondaryContainer,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.touch_app,
                          size: 10,
                          color: context.colors.primary,
                        ),
                        Text(
                          ' Tap',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: context.colors.primary,
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
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 3),
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
    margin: EdgeInsets.only(right: 5),
    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(
      color: active
          ? context.colors.primary
          : context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(16),
    ),
    child: Text(
      label,
      style: TextStyle(
        color: active
            ? context.colors.onPrimary
            : context.colors.onSurfaceVariant,
        fontSize: 11.5,
        fontWeight: FontWeight.w700,
      ),
    ),
  );

  Widget _mapCard() => Container(
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(12),
    ),
    clipBehavior: Clip.antiAlias,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          color: context.colors.surfaceContainerLow,
          padding: EdgeInsets.fromLTRB(10, 9, 10, 7),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.map_outlined,
                    color: context.colors.primary,
                    size: 14,
                  ),
                  SizedBox(width: 5),
                  Expanded(
                    child: Text(
                      'GEOGRAPHY MAP',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w800,
                        color: context.colors.primary,
                        letterSpacing: .3,
                      ),
                    ),
                  ),
                  _badge(
                    'KENYA COUNTY MAP',
                    bg: context.colors.secondaryContainer,
                  ),
                ],
              ),
              SizedBox(height: 7),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          selectedPlace?.name ?? 'Explore Kenya',
                          style: TextStyle(
                            fontFamily: 'serif',
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: context.colors.onSurface,
                          ),
                        ),
                        Text(
                          selectedPlace?.displayName ?? 'Select a county to explore its constituencies and local boundaries.',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 12.5,
                            color: context.colors.onSurface,
                          ),
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
                    child: Text(
                      'Search',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: context.colors.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        SizedBox(
          height: 420,
          child: CinematicGlobeMap(
            selectedPlace: selectedPlace,
            height: 420,
            cinematicIntro: true,
            onPlaceSelected: (place) => setState(() => selectedPlace = place),
            onSceneChanged: (scene) => setState(() => selectedScene = scene),
          ),
        ),
        Container(
          padding: EdgeInsets.fromLTRB(14, 12, 14, 14),
          color: context.colors.surfaceContainerLow,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.touch_app_outlined,
                    size: 18,
                    color: context.colors.primary,
                  ),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _mapInstruction,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              Text(
                _mapAttribution,
                style: Theme.of(context).textTheme.bodySmall
                    ?.copyWith(color: context.colors.onSurfaceVariant),
              ),
              SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: FilledButton.tonalIcon(
                      onPressed: () => widget.onNavigate?.call(1),
                      icon: Icon(Icons.explore_outlined),
                      label: Text('Explore map'),
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: chooseLocation,
                      icon: Icon(Icons.search),
                      label: Text('Find a place'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    ),
  );

  GeographyFeatureProperties? get _firstChildProperties {
    final features =
        selectedScene?.childBoundaries?.features ?? const <GeographyFeature>[];
    return features.isEmpty ? null : features.first.properties;
  }

  String get _mapInstruction {
    final place = selectedPlace;
    if (place == null) {
      return 'Tap a verified county to view its constituencies.';
    }
    final children =
        selectedScene?.childBoundaries?.features ?? const <GeographyFeature>[];
    final childLevel = _firstChildProperties?.level.trim();
    if (children.isNotEmpty) {
      final level = childLevel?.isNotEmpty == true
          ? childLevel!.toLowerCase()
          : 'local administrative';
      return '${children.length} verified $level boundaries in ${place.name}';
    }
    if (selectedScene != null) {
      return 'No verified child boundaries are available for ${place.name} yet.';
    }
    return 'Loading verified boundaries for ${place.name}…';
  }

  String get _mapAttribution {
    final metadata = selectedPlace?.boundaryMetadata;
    final source = metadata?.source?.trim();
    final license = metadata?.license?.trim();
    final detail = [
      source,
      license,
    ].where((value) => value != null && value.isNotEmpty).join(' · ');
    return detail.isEmpty
        ? 'NASA GIBS imagery · Verified boundaries from the Mzizi geography API.'
        : 'NASA GIBS imagery · $detail';
  }

  Widget _sectionTitle(
    String title, {
    String? trailing,
    String? eyebrow,
    VoidCallback? onTap,
  }) => Padding(
    padding: EdgeInsets.fromLTRB(1, 0, 1, 7),
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
                  style: TextStyle(
                    fontSize: 11,
                    letterSpacing: .4,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
              Text(
                title,
                style: TextStyle(
                  fontFamily: 'serif',
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: context.colors.onSurface,
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
              style: TextStyle(
                fontSize: 11.5,
                color: context.colors.primary,
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
        physics: NeverScrollableScrollPhysics(),
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
      padding: EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border.all(color: context.colors.outlineVariant),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _iconBox(icon),
              Spacer(),
              Text(
                n,
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
          Spacer(),
          Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: context.colors.onSurface,
            ),
          ),
          Text(
            desc,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11.5,
              color: context.colors.onSurfaceVariant,
              height: 1.25,
            ),
          ),
        ],
      ),
    ),
  );
  Widget _iconBox(IconData icon) => Container(
    width: 22,
    height: 22,
    decoration: BoxDecoration(
      color: context.colors.secondaryContainer,
      borderRadius: BorderRadius.circular(6),
    ),
    child: Icon(icon, size: 13, color: context.colors.primary),
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
      SizedBox(height: 5),
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
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            _badge(
              tag,
              bg: id == 0
                  ? context.warningColor
                  : context.colors.secondaryContainer,
              color: id == 0 ? context.warningColor : context.colors.primary,
            ),
            SizedBox(width: 5),
            Icon(
              Icons.schedule,
              size: 10,
              color: context.colors.onSurfaceVariant,
            ),
            SizedBox(width: 3),
            Text(
              time,
              style: TextStyle(
                fontSize: 11,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            Spacer(),
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
                    ? context.colors.primary
                    : context.colors.onSurfaceVariant,
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
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
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                      color: context.colors.onSurface,
                    ),
                  ),
                  SizedBox(height: 3),
                  Text(
                    desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11.5,
                      color: context.colors.onSurfaceVariant,
                      height: 1.2,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(width: 7),
            Container(
              width: 48,
              height: 43,
              decoration: BoxDecoration(
                color: id == 0
                    ? context.warningColor
                    : context.colors.secondaryContainer,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Icon(
                id == 0
                    ? Icons.account_balance
                    : image == 'groups'
                    ? Icons.groups
                    : Icons.account_balance_outlined,
                color: context.colors.primary,
                size: 24,
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
        Row(
          children: [
            Text(
              ref,
              style: TextStyle(
                fontSize: 10.5,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            Spacer(),
            Text(
              'Read Briefing →',
              style: TextStyle(
                fontSize: 11.5,
                color: context.colors.primary,
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
      SizedBox(height: 5),
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
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(9),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              icon,
              size: 13,
              color: red ? context.colors.error : context.colors.primary,
            ),
            SizedBox(width: 5),
            _badge(
              org,
              bg: red
                  ? context.colors.error
                  : context.colors.secondaryContainer,
              color: red
                  ? context.colors.error
                  : context.colors.onSurfaceVariant,
            ),
            Spacer(),
            Text(
              date,
              style: TextStyle(
                fontSize: 11,
                color: context.colors.onSurfaceVariant,
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
        Text(
          title,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            height: 1.2,
            color: context.colors.onSurface,
          ),
        ),
        SizedBox(height: 5),
        Row(
          children: [
            Text(
              ref,
              style: TextStyle(
                fontSize: 10.5,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            Spacer(),
            InkWell(
              onTap: () => notice(
                action,
                'Sample source record. Open the originating institution portal to verify publication details.',
              ),
              child: Text(
                '$action ↗',
                style: TextStyle(
                  fontSize: 11,
                  color: context.colors.primary,
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
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      children: [
        Row(
          children: [
            Icon(
              Icons.history,
              size: 12,
              color: context.colors.onSurfaceVariant,
            ),
            SizedBox(width: 4),
            Expanded(
              child: Text(
                'CONTINUE EXPLORING',
                style: TextStyle(
                  fontSize: 11,
                  color: context.colors.onSurfaceVariant,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            _badge(
              '78% Verified',
              bg: context.colors.secondaryContainer,
              color: context.colors.primary,
            ),
          ],
        ),
        SizedBox(height: 6),
        Row(
          children: [
            Container(
              width: 48,
              height: 40,
              decoration: BoxDecoration(
                color: context.colors.outline,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Icon(
                Icons.landscape_outlined,
                color: context.colors.primary,
              ),
            ),
            SizedBox(width: 7),
            Expanded(
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
                    style: TextStyle(
                      fontSize: 11,
                      color: context.colors.onSurfaceVariant,
                    ),
                  ),
                  SizedBox(height: 5),
                  LinearProgressIndicator(
                    value: .78,
                    minHeight: 3,
                    backgroundColor: context.colors.outlineVariant,
                    color: context.colors.primary,
                  ),
                ],
              ),
            ),
            SizedBox(width: 6),
            InkWell(
              onTap: () => notice(
                'Continue exploring',
                'Nakuru County housing projects • Ward 032. Evidence coverage: 78%.',
              ),
              child: CircleAvatar(
                radius: 12,
                backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                child: Icon(
                  Icons.arrow_forward,
                  color: context.colors.primary,
                  size: 15,
                ),
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
      SizedBox(height: 5),
      _source(
        Icons.gavel_outlined,
        'Office of the Auditor-General (OAG)',
        'National & County annual audit ledgers, qualified opinions, forensic reports, and special inquiry filings.',
        '47 Counties Indexed • Vol. I–IV',
        'OAG Reports ↗',
        'Verified Statutory',
      ),
      SizedBox(height: 5),
      _source(
        Icons.account_balance_wallet_outlined,
        'National Treasury & Planning',
        'Quarterly Economic and Budget Review (QEBR), IFMIS expenditure transfers, and public debt bulletins.',
        'Quarterly Ingest • Q1 FY 2024/25',
        'Treasury Portal ↗',
        'Verified Statutory',
      ),
      SizedBox(height: 5),
      _source(
        Icons.bar_chart,
        'KNBS & Demographic Census',
        'Kenya National Bureau of Statistics 2019 Census, sub-county population density, and poverty index measures.',
        'KNBS Volume I–IV Projections',
        'KNBS Data ↗',
        'Official Baseline',
      ),
      SizedBox(height: 5),
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
    padding: EdgeInsets.all(8),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(9),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 14, color: context.colors.primary),
            SizedBox(width: 6),
            Expanded(
              child: Text(
                name,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  height: 1.2,
                  color: context.colors.onSurface,
                ),
              ),
            ),
            SizedBox(width: 4),
            _badge(
              badge,
              bg: badge == 'Live Feed'
                  ? context.colors.secondaryContainer
                  : badge == 'Official Baseline'
                  ? context.colors.secondaryContainer
                  : context.colors.secondaryContainer,
              color: badge == 'Official Baseline'
                  ? context.colors.onSurfaceVariant
                  : context.colors.primary,
            ),
          ],
        ),
        SizedBox(height: 4),
        Padding(
          padding: EdgeInsets.only(left: 20),
          child: Text(
            desc,
            style: TextStyle(
              fontSize: 11,
              color: context.colors.onSurfaceVariant,
              height: 1.25,
            ),
          ),
        ),
        SizedBox(height: 5),
        Padding(
          padding: EdgeInsets.only(left: 20),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  meta,
                  style: TextStyle(
                    fontSize: 10.5,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
              ),
              InkWell(
                onTap: () => notice(
                  action,
                  'Institutional source link. Confirm current records with the source institution.',
                ),
                child: Text(
                  action,
                  style: TextStyle(
                    fontSize: 11,
                    color: context.colors.primary,
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
    padding: EdgeInsets.fromLTRB(10, 10, 10, 5),
    decoration: BoxDecoration(
      border: Border(top: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.storage_outlined,
              size: 10,
              color: context.colors.onSurfaceVariant,
            ),
            SizedBox(width: 4),
            Text(
              'PUBLIC RESEARCH ENGINE',
              style: TextStyle(
                fontSize: 10.5,
                color: context.colors.onSurfaceVariant,
                letterSpacing: .3,
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
        Text(
          'All data displayed is for civic illustration and research purposes. Verify with the Kenya Open Data Initiative principles.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 10.5,
            color: context.colors.onSurfaceVariant,
            height: 1.3,
          ),
        ),
      ],
    ),
  );
  Widget _badge(String text, {required Color bg, Color? color}) => Container(
    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Text(
      text,
      style: TextStyle(
        fontSize: 10.5,
        color: color ?? context.colors.onSurfaceVariant,
        fontWeight: FontWeight.w600,
      ),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    ),
  );
}
