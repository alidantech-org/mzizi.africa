import 'package:flutter/material.dart';

import '../data/geography_api.dart';
import '../theme/app_colors.dart';
import '../widgets/cinematic_globe_map.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key, this.onNavigate});

  final ValueChanged<int>? onNavigate;

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _search = TextEditingController();
  final _focus = FocusNode();
  GeographyEntity? _selected;
  GeographyScene? _scene;
  bool _mapLoading = false;
  List<GeographyEntity> _results = const [];
  bool _searching = false;
  String? _searchError;
  int _searchGeneration = 0;

  @override
  void dispose() {
    _search.dispose();
    _focus.dispose();
    super.dispose();
  }

  Future<void> _searchPlaces([String? value]) async {
    final query = (value ?? _search.text).trim();
    if (query.isEmpty) return;
    final generation = ++_searchGeneration;
    setState(() {
      _searching = true;
      _searchError = null;
      _results = const [];
    });
    try {
      final results = await GeographyApiClient.instance.search(query);
      if (!mounted || generation != _searchGeneration) return;
      setState(() {
        _results = results;
        _searching = false;
        if (results.isEmpty) _searchError = 'No matching areas were found.';
      });
    } catch (error) {
      if (!mounted || generation != _searchGeneration) return;
      setState(() {
        _searching = false;
        _searchError = error.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  Future<void> _select(GeographyEntity place) async {
    _focus.unfocus();
    setState(() {
      _selected = place;
      _scene = null;
      _mapLoading = true;
      _results = const [];
      _searchError = null;
    });
  }

  Future<void> _goToParent() async {
    final parentId = _selected?.parentId;
    if (parentId == null) {
      _reset();
      return;
    }
    try {
      final parent = await GeographyApiClient.instance.entity(parentId);
      if (mounted) await _select(parent);
    } catch (error) {
      if (mounted) {
        setState(
          () => _searchError = error.toString().replaceFirst('Exception: ', ''),
        );
      }
    }
  }

  void _reset() {
    setState(() {
      _selected = null;
      _scene = null;
      _mapLoading = false;
      _results = const [];
      _searchError = null;
      _search.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 900;
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F3),
      bottomNavigationBar: _bottomNav(),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1480),
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                wide ? 28 : 16,
                14,
                wide ? 28 : 16,
                18,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _header(wide),
                  const SizedBox(height: 16),
                  _searchBox(),
                  if (_results.isNotEmpty || _searchError != null || _searching)
                    _searchFeedback(),
                  if (_selected != null) ...[
                    const SizedBox(height: 12),
                    _breadcrumbs(),
                  ],
                  const SizedBox(height: 12),
                  Expanded(
                    child: wide
                        ? Row(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Expanded(
                                flex: 7,
                                child: _mapPanel(double.infinity),
                              ),
                              const SizedBox(width: 16),
                              SizedBox(width: 330, child: _detailsPanel()),
                            ],
                          )
                        : Column(
                            children: [
                              Expanded(child: _mapPanel(double.infinity)),
                              const SizedBox(height: 12),
                              SizedBox(height: 210, child: _detailsPanel()),
                            ],
                          ),
                  ),
                  const SizedBox(height: 9),
                  _attribution(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _header(bool wide) => Row(
    children: [
      Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: forest,
          borderRadius: BorderRadius.circular(13),
        ),
        child: const Icon(Icons.public, color: Colors.white, size: 23),
      ),
      const SizedBox(width: 11),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'MZIZI AFRICA  /  ${wide ? 'GEOGRAPHY EXPLORER' : 'EXPLORE'}',
              style: const TextStyle(
                color: forest,
                fontSize: 13,
                letterSpacing: 1.5,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              _selected?.name ?? 'Explore Kenya',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: ink,
                fontSize: 26,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
      if (wide && _selected != null)
        OutlinedButton.icon(
          onPressed: _reset,
          icon: const Icon(Icons.public, size: 17),
          label: const Text('Reset globe'),
        ),
    ],
  );

  Widget _searchBox() => Material(
    elevation: 1,
    shadowColor: Colors.black12,
    borderRadius: BorderRadius.circular(13),
    child: TextField(
      controller: _search,
      focusNode: _focus,
      textInputAction: TextInputAction.search,
      onSubmitted: _searchPlaces,
      decoration: InputDecoration(
        hintText: 'Search county, constituency, or ward',
        prefixIcon: const Icon(Icons.search, color: forest),
        suffixIcon: _searching
            ? const Padding(
                padding: EdgeInsets.all(14),
                child: SizedBox(
                  width: 17,
                  height: 17,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              )
            : IconButton(
                tooltip: 'Search geography',
                onPressed: _searchPlaces,
                icon: const Icon(Icons.arrow_forward, color: forest),
              ),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(13),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 14),
      ),
    ),
  );

  Widget _searchFeedback() => Container(
    constraints: const BoxConstraints(maxHeight: 230),
    margin: const EdgeInsets.only(top: 7),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: line),
    ),
    child: _searching
        ? const ListTile(
            leading: SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            title: Text('Searching Mzizi geography…'),
          )
        : _results.isNotEmpty
        ? ListView.separated(
            shrinkWrap: true,
            itemCount: _results.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final place = _results[index];
              return ListTile(
                dense: true,
                leading: const Icon(Icons.place_outlined, color: forest),
                title: Text(
                  place.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                subtitle: Text(
                  [
                    place.level,
                    place.parentName,
                  ].whereType<String>().where((e) => e.isNotEmpty).join(' · '),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                trailing: place.boundaryVerified
                    ? const Icon(
                        Icons.verified_outlined,
                        color: forest,
                        size: 18,
                      )
                    : const Icon(Icons.info_outline, color: muted, size: 18),
                onTap: () => _select(place),
              );
            },
          )
        : ListTile(
            leading: const Icon(Icons.info_outline, color: muted),
            title: Text(
              _searchError ?? 'No matching areas were found.',
              style: const TextStyle(fontSize: 16),
            ),
          ),
  );

  Widget _breadcrumbs() {
    final path = [..._selected!.ancestors, _selected!];
    return SizedBox(
      height: 34,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: path.length + 1,
        separatorBuilder: (_, _) =>
            const Icon(Icons.chevron_right, size: 16, color: muted),
        itemBuilder: (context, index) {
          if (index == 0) {
            return TextButton.icon(
              onPressed: _goToParent,
              icon: const Icon(Icons.arrow_back, size: 15),
              label: const Text('Parent'),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 7),
              ),
            );
          }
          final place = path[index - 1];
          final current = index == path.length;
          return Center(
            child: InkWell(
              onTap: current ? null : () => _select(place),
              child: Text(
                place.name,
                style: TextStyle(
                  fontSize: 14.5,
                  color: current ? forest : muted,
                  fontWeight: current ? FontWeight.w800 : FontWeight.w500,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _mapPanel(double height) => CinematicGlobeMap(
    selectedPlace: _selected,
    height: height,
    onPlaceSelected: (place) => setState(() => _selected = place),
    onSceneChanged: (scene) => setState(() {
      _scene = scene;
      _mapLoading = false;
    }),
  );

  Widget _detailsPanel() => Container(
    padding: const EdgeInsets.all(15),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(15),
      border: Border.all(color: line),
    ),
    child: _selected == null ? _emptyDetails() : _selectedDetails(),
  );

  Widget _emptyDetails() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text(
        'Navigate by geography',
        style: TextStyle(
          color: ink,
          fontSize: 19.5,
          fontWeight: FontWeight.w800,
        ),
      ),
      const SizedBox(height: 8),
      const Text(
        'Search for a Kenyan county, constituency, or ward, or rotate and zoom the map. Tap a highlighted area to explore its local areas.',
        style: TextStyle(color: muted, fontSize: 16, height: 1.45),
      ),
      const Spacer(),
      _metadataLine(Icons.touch_app_outlined, 'Drag to rotate · pinch to zoom'),
      const SizedBox(height: 7),
      _metadataLine(
        Icons.account_tree_outlined,
        'Explore counties, constituencies, and wards across Kenya',
      ),
    ],
  );

  Widget _selectedDetails() {
    final place = _selected!;
    final scene = _scene;
    final boundaryVerified =
        scene?.hasVerifiedGeometry ?? place.boundaryVerified;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.location_on_outlined, size: 18, color: forest),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                place.level.isEmpty ? 'Geographic area' : place.level,
                style: const TextStyle(
                  fontSize: 13,
                  color: muted,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            if (place.parentId != null)
              IconButton(
                tooltip: 'Go to parent area',
                onPressed: _goToParent,
                icon: const Icon(Icons.north_west, size: 17),
                visualDensity: VisualDensity.compact,
              ),
          ],
        ),
        Text(
          place.name,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 22.5,
            height: 1.1,
            color: ink,
            fontWeight: FontWeight.w800,
          ),
        ),
        if (place.parentName != null) ...[
          const SizedBox(height: 4),
          Text(
            'Within ${place.parentName}',
            style: const TextStyle(fontSize: 14.5, color: muted),
          ),
        ],
        const SizedBox(height: 12),
        _metadataLine(
          place.boundaryVerified
              ? Icons.verified_outlined
              : Icons.warning_amber_outlined,
          boundaryVerified
              ? 'Verified boundary${place.boundaryYear == null ? '' : ' · ${place.boundaryYear}'}'
              : 'No verified boundary available',
          color: boundaryVerified ? forest : const Color(0xFF9A5C08),
        ),
        if (place.boundarySource != null) ...[
          const SizedBox(height: 6),
          _metadataLine(Icons.source_outlined, place.boundarySource!),
        ],
        if (place.boundaryLicense != null) ...[
          const SizedBox(height: 4),
          _metadataLine(Icons.policy_outlined, place.boundaryLicense!),
        ],
        const Divider(height: 20),
        const Text(
          'GOVERNANCE INFORMATION',
          style: TextStyle(
            fontSize: 12.5,
            letterSpacing: 1,
            color: muted,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 6),
        Expanded(
          child: _mapLoading
              ? const Align(
                  alignment: Alignment.topLeft,
                  child: Text(
                    'Loading area details…',
                    style: TextStyle(fontSize: 14.5, color: muted),
                  ),
                )
              : _governance(scene?.governance),
        ),
      ],
    );
  }

  Widget _governance(Map<String, dynamic>? data) {
    final sections = data?['sections'];
    if (sections is! List || sections.isEmpty) {
      return const Align(
        alignment: Alignment.topLeft,
        child: Text(
          'No linked governance records were returned by the API.',
          style: TextStyle(fontSize: 14.5, color: muted, height: 1.4),
        ),
      );
    }
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        for (final section in sections.whereType<Map<String, dynamic>>()) ...[
          Padding(
            padding: const EdgeInsets.only(top: 6, bottom: 3),
            child: Text(
              (section['title'] ?? section['name'] ?? 'Records').toString(),
              style: const TextStyle(
                fontSize: 14.5,
                fontWeight: FontWeight.w800,
                color: ink,
              ),
            ),
          ),
          if (section['records'] is List)
            for (final record
                in (section['records'] as List)
                    .whereType<Map<String, dynamic>>())
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(
                  Icons.article_outlined,
                  size: 15,
                  color: forest,
                ),
                title: Text(
                  (record['title'] ?? record['name'] ?? 'Record').toString(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 14.5),
                ),
                subtitle: Text(
                  (record['summary'] ?? record['description'] ?? '').toString(),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 13),
                ),
              ),
        ],
      ],
    );
  }

  Widget _metadataLine(IconData icon, String text, {Color color = muted}) =>
      Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              text,
              style: TextStyle(fontSize: 13, color: color, height: 1.3),
            ),
          ),
        ],
      );

  Widget _attribution() => const Row(
    children: [
      Icon(Icons.public, size: 13, color: muted),
      SizedBox(width: 6),
      Expanded(
        child: Text(
          'Globe imagery: NASA Global Imagery Browse Services (GIBS) · Boundaries and attribution are provided by Mzizi geography services.',
          style: TextStyle(fontSize: 12.5, color: muted),
        ),
      ),
    ],
  );

  Widget _bottomNav() => SafeArea(
    top: false,
    child: Container(
      decoration: const BoxDecoration(
        color: Color(0xFFFAFCFA),
        border: Border(top: BorderSide(color: line)),
      ),
      padding: const EdgeInsets.only(top: 7, bottom: 8),
      child: Row(
        children: [
          _navItem(0, Icons.home_outlined, 'Home'),
          _navItem(1, Icons.explore_outlined, 'Explore'),
          _navItem(2, Icons.account_balance_wallet_outlined, 'Money'),
          _navItem(3, Icons.history, 'History'),
          _navItem(4, Icons.bookmark_border, 'Saved'),
        ],
      ),
    ),
  );

  Widget _navItem(int index, IconData icon, String label) => Expanded(
    child: Semantics(
      button: true,
      selected: index == 1,
      label: label,
      child: InkWell(
        onTap: () => widget.onNavigate?.call(index),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 19, color: index == 1 ? forest : muted),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                color: index == 1 ? forest : muted,
                fontWeight: index == 1 ? FontWeight.w700 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
