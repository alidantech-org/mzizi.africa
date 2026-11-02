import 'package:flutter/material.dart';

import 'dart:async';

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
  Timer? _searchDebounce;
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
    _searchDebounce?.cancel();
    super.dispose();
  }

  Future<void> _searchPlaces([String? value]) async {
    _searchDebounce?.cancel();
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
    _searchDebounce?.cancel();
    ++_searchGeneration;
    _focus.unfocus();
    setState(() {
      _selected = place;
      _scene = null;
      _mapLoading = true;
      _searching = false;
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

  Future<void> _selectAncestor(GeographyAncestor ancestor) async {
    try {
      final entity = await GeographyApiClient.instance.entity(ancestor.id);
      if (mounted) await _select(entity);
    } catch (error) {
      if (mounted) {
        setState(
          () => _searchError = error.toString().replaceFirst('Exception: ', ''),
        );
      }
    }
  }

  void _reset() {
    _searchDebounce?.cancel();
    ++_searchGeneration;
    setState(() {
      _selected = null;
      _scene = null;
      _mapLoading = false;
      _searching = false;
      _results = const [];
      _searchError = null;
      _search.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 900;
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 1480),
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
                  SizedBox(height: 16),
                  _searchBox(),
                  if (_results.isNotEmpty || _searchError != null || _searching)
                    _searchFeedback(),
                  if (_selected != null) ...[
                    SizedBox(height: 12),
                    _breadcrumbs(),
                  ],
                  SizedBox(height: 12),
                  Expanded(
                    child: wide
                        ? Row(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Expanded(
                                flex: 7,
                                child: _mapPanel(double.infinity),
                              ),
                              SizedBox(width: 16),
                              SizedBox(width: 330, child: _detailsPanel()),
                            ],
                          )
                        : Column(
                            children: [
                              Expanded(child: _mapPanel(double.infinity)),
                              SizedBox(height: 12),
                              SizedBox(height: 210, child: _detailsPanel()),
                            ],
                          ),
                  ),
                  SizedBox(height: 9),
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
          color: context.colors.primary,
          borderRadius: BorderRadius.circular(13),
        ),
        child: Icon(Icons.public, color: context.colors.onPrimary, size: 23),
      ),
      SizedBox(width: 11),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'MZIZI AFRICA  /  ${wide ? 'GEOGRAPHY EXPLORER' : 'EXPLORE'}',
              style: TextStyle(
                color: context.colors.primary,
                fontSize: 13,
                letterSpacing: 1.5,
                fontWeight: FontWeight.w800,
              ),
            ),
            SizedBox(height: 2),
            Text(
              _selected?.name ??
                  (GeographyApiClient.defaultCountry == 'KE'
                      ? 'Explore Kenya'
                      : 'Explore geography'),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontFamily: 'serif',
                color: context.colors.onSurface,
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
          icon: Icon(Icons.public, size: 17),
          label: Text('Reset globe'),
        ),
    ],
  );

  Widget _searchBox() => Material(
    elevation: 1,
    shadowColor: context.colors.shadow.withValues(alpha: .12),
    borderRadius: BorderRadius.circular(13),
    child: TextField(
      controller: _search,
      focusNode: _focus,
      textInputAction: TextInputAction.search,
      onSubmitted: _searchPlaces,
      onChanged: (value) {
        _searchDebounce?.cancel();
        ++_searchGeneration;
        setState(() {
          _results = const [];
          _searchError = null;
          _searching = false;
        });
        if (value.trim().isEmpty) {
          return;
        }
        _searchDebounce = Timer(Duration(milliseconds: 350), () {
          if (mounted) _searchPlaces(value);
        });
      },
      decoration: InputDecoration(
        hintText: 'Search a place or administrative area',
        prefixIcon: Icon(Icons.search, color: context.colors.primary),
        suffixIcon: _searching
            ? Padding(
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
                icon: Icon(Icons.arrow_forward, color: context.colors.primary),
              ),
        filled: true,
        fillColor: Theme.of(context).scaffoldBackgroundColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(13),
          borderSide: BorderSide.none,
        ),
        contentPadding: EdgeInsets.symmetric(vertical: 14),
      ),
    ),
  );

  Widget _searchFeedback() => Container(
    constraints: BoxConstraints(maxHeight: 230),
    margin: EdgeInsets.only(top: 7),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: _searching
        ? ListTile(
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
            separatorBuilder: (_, _) => Divider(height: 1),
            itemBuilder: (context, index) {
              final place = _results[index];
              return ListTile(
                dense: true,
                leading: Icon(
                  Icons.place_outlined,
                  color: context.colors.primary,
                ),
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
                    ? Icon(
                        Icons.verified_outlined,
                        color: context.colors.primary,
                        size: 18,
                      )
                    : Icon(
                        Icons.info_outline,
                        color: context.colors.onSurfaceVariant,
                        size: 18,
                      ),
                onTap: () => _select(place),
              );
            },
          )
        : ListTile(
            leading: Icon(
              Icons.info_outline,
              color: context.colors.onSurfaceVariant,
            ),
            title: Text(
              _searchError ?? 'No matching areas were found.',
              style: TextStyle(fontSize: 16),
            ),
          ),
  );

  Widget _breadcrumbs() {
    final ancestors = _selected!.ancestors;
    return SizedBox(
      height: 34,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: ancestors.length + 2,
        separatorBuilder: (_, _) => Icon(
          Icons.chevron_right,
          size: 16,
          color: context.colors.onSurfaceVariant,
        ),
        itemBuilder: (context, index) {
          if (index == 0) {
            return TextButton.icon(
              onPressed: _goToParent,
              icon: Icon(Icons.arrow_back, size: 15),
              label: Text('Parent'),
              style: TextButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 7),
              ),
            );
          }
          final current = index == ancestors.length + 1;
          final name = current ? _selected!.name : ancestors[index - 1].name;
          return Center(
            child: InkWell(
              onTap: current
                  ? null
                  : () => _selectAncestor(ancestors[index - 1]),
              child: Text(
                name,
                style: TextStyle(
                  fontSize: 14.5,
                  color: current
                      ? context.colors.primary
                      : context.colors.onSurfaceVariant,
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
    padding: EdgeInsets.all(15),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      borderRadius: BorderRadius.circular(15),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: _selected == null ? _emptyDetails() : _selectedDetails(),
  );

  Widget _emptyDetails() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        'Navigate by geography',
        style: TextStyle(
          color: context.colors.onSurface,
          fontSize: 19.5,
          fontWeight: FontWeight.w800,
        ),
      ),
      SizedBox(height: 8),
      Text(
        'Search for a place, or rotate and zoom the map. Tap a verified area to explore its local areas.',
        style: TextStyle(
          color: context.colors.onSurfaceVariant,
          fontSize: 16,
          height: 1.45,
        ),
      ),
      Spacer(),
      _metadataLine(Icons.touch_app_outlined, 'Drag to rotate · pinch to zoom'),
      SizedBox(height: 7),
      _metadataLine(
        Icons.account_tree_outlined,
        'Follow the administrative hierarchy provided by Mzizi geography',
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
            Icon(
              Icons.location_on_outlined,
              size: 18,
              color: context.colors.primary,
            ),
            SizedBox(width: 6),
            Expanded(
              child: Text(
                place.level.isEmpty ? 'Geographic area' : place.level,
                style: TextStyle(
                  fontSize: 13,
                  color: context.colors.onSurfaceVariant,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            if (place.parentId != null)
              IconButton(
                tooltip: 'Go to parent area',
                onPressed: _goToParent,
                icon: Icon(Icons.north_west, size: 17),
                visualDensity: VisualDensity.compact,
              ),
          ],
        ),
        Text(
          place.name,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 22.5,
            height: 1.1,
            color: context.colors.onSurface,
            fontWeight: FontWeight.w800,
          ),
        ),
        if (place.parentName != null) ...[
          SizedBox(height: 4),
          Text(
            'Within ${place.parentName}',
            style: TextStyle(
              fontSize: 14.5,
              color: context.colors.onSurfaceVariant,
            ),
          ),
        ],
        SizedBox(height: 12),
        _metadataLine(
          place.boundaryVerified
              ? Icons.verified_outlined
              : Icons.warning_amber_outlined,
          boundaryVerified
              ? 'Verified boundary${place.boundaryYear == null ? '' : ' · ${place.boundaryYear}'}'
              : 'No verified boundary available',
          color: boundaryVerified
              ? context.colors.primary
              : context.warningColor,
        ),
        if (place.boundarySource != null) ...[
          SizedBox(height: 6),
          _metadataLine(Icons.source_outlined, place.boundarySource!),
        ],
        if (place.boundaryLicense != null) ...[
          SizedBox(height: 4),
          _metadataLine(Icons.policy_outlined, place.boundaryLicense!),
        ],
        Divider(height: 20),
        Text(
          'GOVERNANCE INFORMATION',
          style: TextStyle(
            fontSize: 12.5,
            letterSpacing: 1,
            color: context.colors.onSurfaceVariant,
            fontWeight: FontWeight.w800,
          ),
        ),
        SizedBox(height: 6),
        Expanded(
          child: _mapLoading
              ? Align(
                  alignment: Alignment.topLeft,
                  child: Text(
                    'Loading area details…',
                    style: TextStyle(
                      fontSize: 14.5,
                      color: context.colors.onSurfaceVariant,
                    ),
                  ),
                )
              : _governance(scene?.governance),
        ),
      ],
    );
  }

  Widget _governance(GeographyGovernance? data) {
    final sections = data?.sections;
    if (sections == null || sections.isEmpty) {
      return Align(
        alignment: Alignment.topLeft,
        child: Text(
          'No linked governance records were returned by the API.',
          style: TextStyle(
            fontSize: 14.5,
            color: context.colors.onSurfaceVariant,
            height: 1.4,
          ),
        ),
      );
    }
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        for (final section in sections) ...[
          Padding(
            padding: EdgeInsets.only(top: 6, bottom: 3),
            child: Text(
              section.title,
              style: TextStyle(
                fontSize: 14.5,
                fontWeight: FontWeight.w800,
                color: context.colors.onSurface,
              ),
            ),
          ),
          if (section.records.isNotEmpty)
            for (final record in section.records)
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: Icon(
                  Icons.article_outlined,
                  size: 15,
                  color: context.colors.primary,
                ),
                title: Text(
                  record.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 14.5),
                ),
                subtitle: Text(
                  record.summary ?? '',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 13),
                ),
              ),
        ],
      ],
    );
  }

  Widget _metadataLine(IconData icon, String text, {Color? color}) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Icon(icon, size: 14, color: color ?? context.colors.onSurfaceVariant),
      SizedBox(width: 6),
      Expanded(
        child: Text(
          text,
          style: TextStyle(
            fontSize: 13,
            color: color ?? context.colors.onSurfaceVariant,
            height: 1.3,
          ),
        ),
      ),
    ],
  );

  Widget _attribution() => Row(
    children: [
      Icon(Icons.public, size: 13, color: context.colors.onSurfaceVariant),
      SizedBox(width: 6),
      Expanded(
        child: Text(
          'Globe imagery: NASA Global Imagery Browse Services (GIBS) · Boundaries and attribution are provided by Mzizi geography services.',
          style: TextStyle(
            fontSize: 12.5,
            color: context.colors.onSurfaceVariant,
          ),
        ),
      ),
    ],
  );
}
