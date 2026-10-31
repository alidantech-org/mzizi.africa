import 'dart:convert';

import 'package:flutter/material.dart';

import '../data/geography_api.dart';
import '../theme/app_colors.dart';
import 'globe_map_surface.dart';
import 'globe_map_surface_stub.dart'
    if (dart.library.io) 'globe_map_surface_mobile.dart'
    if (dart.library.js_interop) 'globe_map_surface_web.dart'
    as globe_surface;

class CinematicGlobeMap extends StatefulWidget {
  const CinematicGlobeMap({
    super.key,
    this.selectedPlace,
    this.height = 360,
    this.cinematicIntro = false,
    this.onPlaceSelected,
    this.onSceneChanged,
  });

  final GeographyEntity? selectedPlace;
  final double height;
  final bool cinematicIntro;
  final ValueChanged<GeographyEntity?>? onPlaceSelected;
  final ValueChanged<GeographyScene?>? onSceneChanged;

  @override
  State<CinematicGlobeMap> createState() => _CinematicGlobeMapState();
}

class _CinematicGlobeMapState extends State<CinematicGlobeMap> {
  late final GlobeMapSurface _surface;
  bool _pageReady = false;
  bool _loading = false;
  bool _configSent = false;
  bool _initialBoundariesRequested = false;
  String? _error;
  String? _warning;
  int _selectionGeneration = 0;
  String? _requestedId;
  String? _loadedId;
  GeographyScene? _scene;

  static const _ionToken = String.fromEnvironment('CESIUM_ION_TOKEN');
  static final _initialLongitude =
      double.tryParse(String.fromEnvironment('MZIZI_MAP_INITIAL_LONGITUDE')) ??
      37.9;
  static final _initialLatitude =
      double.tryParse(String.fromEnvironment('MZIZI_MAP_INITIAL_LATITUDE')) ??
      -0.3;
  static final _initialHeight =
      double.tryParse(String.fromEnvironment('MZIZI_MAP_INITIAL_HEIGHT')) ??
      850000;

  @override
  void initState() {
    super.initState();
    _surface = globe_surface.createGlobeMapSurface(
      onMessage: _onMapMessage,
      onLoad: _onSurfaceLoad,
      onError: _onSurfaceError,
    );
  }

  void _onSurfaceLoad() {
    if (!mounted) return;
    setState(() => _pageReady = true);
    _sendConfig();
    _loadInitialBoundaries();
    if (_scene != null) {
      _pushScene(_scene!);
    } else {
      _syncRequestedPlace();
    }
  }

  Future<void> _loadInitialBoundaries({bool retry = false}) async {
    if (!_pageReady || (_initialBoundariesRequested && !retry)) return;
    _initialBoundariesRequested = true;
    if (!GeographyApiClient.instance.isConfigured) {
      if (mounted) {
        setState(() {
          _warning = 'Set MZIZI_API_BASE_URL to load verified map boundaries.';
        });
      }
      return;
    }
    try {
      final boundaries = await GeographyApiClient.instance.initialBoundaries();
      if (!mounted || !_pageReady) return;
      await _surface.invoke('setInitialBoundaries', {
        'boundaries': boundaries.toJson(),
      });
      if (mounted) setState(() => _warning = null);
    } catch (error) {
      if (mounted) {
        setState(() {
          _initialBoundariesRequested = false;
          _warning = error.toString().replaceFirst('Exception: ', '');
        });
      }
    }
  }

  void _onSurfaceError(String message) {
    if (mounted) setState(() => _error = message);
  }

  @override
  void didUpdateWidget(covariant CinematicGlobeMap oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedPlace?.id != widget.selectedPlace?.id) {
      _syncRequestedPlace();
    }
  }

  Future<void> _sendConfig() async {
    if (!_pageReady || _configSent) return;
    _configSent = true;
    await _surface.invoke('configure', {
      'ionToken': _ionToken,
      'cinematicIntro': widget.cinematicIntro,
      'initialView': {
        'longitude': _initialLongitude,
        'latitude': _initialLatitude,
        'height': _initialHeight,
      },
    });
  }

  Future<void> _syncRequestedPlace() async {
    final place = widget.selectedPlace;
    if (place == null) {
      if (_loadedId != null) _resetGlobe();
      return;
    }
    if (place.id == _requestedId) return;
    await _loadScene(place.id);
  }

  Future<void> _loadScene(String id, {bool forceRefresh = false}) async {
    final generation = ++_selectionGeneration;
    _requestedId = id;
    _scene = null;
    setState(() {
      _loading = true;
      _error = null;
    });
    if (_pageReady) {
      await _surface.invoke('setScene', {
        'loadingLabel': 'Loading verified geography…',
      });
    }
    if (!mounted || generation != _selectionGeneration) return;
    try {
      final scene = await GeographyApiClient.instance.sceneFor(
        id,
        forceRefresh: forceRefresh,
      );
      if (!mounted || generation != _selectionGeneration) return;
      _scene = scene;
      _loadedId = id;
      widget.onSceneChanged?.call(scene);
      widget.onPlaceSelected?.call(scene.entity);
      await _pushScene(scene);
      if (mounted) setState(() => _loading = false);
    } catch (error) {
      if (!mounted || generation != _selectionGeneration) return;
      setState(() {
        _loading = false;
        _error = error.toString().replaceFirst('Exception: ', '');
      });
      widget.onSceneChanged?.call(null);
    }
  }

  Future<void> _pushScene(GeographyScene scene) async {
    if (!_pageReady) return;
    final payload = {
      'selectedId': scene.entity.id,
      'selectedLevel': scene.entity.level,
      'focusFeature': scene.focusFeature?.toJson(),
      'parentBoundary': scene.parentBoundary?.toJson(),
      'siblingBoundaries': scene.siblingBoundaries?.toJson(),
      'childBoundaries': scene.childBoundaries?.toJson(),
      'loadingLabel': scene.hasVerifiedGeometry
          ? ''
          : 'No verified boundary is available for this area',
    };
    await _surface.invoke('setScene', payload);
  }

  void _resetGlobe() {
    ++_selectionGeneration;
    _loadedId = null;
    _requestedId = null;
    _scene = null;
    _error = null;
    _loading = false;
    widget.onSceneChanged?.call(null);
    widget.onPlaceSelected?.call(null);
    if (_pageReady) {
      _surface.invoke('reset');
    }
    setState(() {});
  }

  void _onMapMessage(String message) {
    try {
      final data = jsonDecode(message) as Map<String, dynamic>;
      switch (data['type']) {
        case 'mapReady':
          _loadInitialBoundaries();
          break;
        case 'boundarySelected':
          final id = data['id']?.toString();
          if (id != null && id.isNotEmpty) _resolvePickedEntity(id);
          break;
        case 'mapWarning':
          if (mounted) setState(() => _warning = data['message']?.toString());
          break;
        case 'mapError':
          if (mounted) setState(() => _error = data['message']?.toString());
          break;
      }
    } catch (_) {
      // Ignore malformed messages from the embedded renderer.
    }
  }

  Future<void> _resolvePickedEntity(String id) => _loadScene(id);

  @override
  void dispose() {
    _surface.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: widget.height.isFinite ? widget.height : null,
    child: ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Stack(
        fit: StackFit.expand,
        children: [
          _surface.build(),
          Positioned(
            right: 10,
            top: 10,
            child: Column(
              children: [
                _button(Icons.public, 'Reset to Kenya view', _resetGlobe),
                SizedBox(height: 6),
                _button(Icons.add, 'Zoom in', () => _runMapAction('zoomIn')),
                SizedBox(height: 6),
                _button(
                  Icons.remove,
                  'Zoom out',
                  () => _runMapAction('zoomOut'),
                ),
              ],
            ),
          ),
          if (_loading)
            Positioned(
              top: 10,
              left: 10,
              child: _MapStatus(
                icon: Icons.travel_explore,
                text: 'Loading verified geography…',
                busy: true,
              ),
            ),
          if (_error != null)
            Positioned(
              left: 10,
              right: 58,
              top: 10,
              child: _MapStatus(
                icon: Icons.cloud_off_outlined,
                text: _error!,
                onRetry: _requestedId == null
                    ? null
                    : () => _loadScene(_requestedId!, forceRefresh: true),
              ),
            ),
          if (_warning != null)
            Positioned(
              left: 10,
              right: 58,
              bottom: 8,
              child: _MapStatus(
                icon: Icons.info_outline,
                text: _warning!,
                onRetry: () => _loadInitialBoundaries(retry: true),
              ),
            ),
          if (!_pageReady)
            ColoredBox(
              color: Theme.of(context).scaffoldBackgroundColor,
              child: Center(
                child: CircularProgressIndicator(color: context.colors.primary),
              ),
            ),
        ],
      ),
    ),
  );

  Widget _button(IconData icon, String label, VoidCallback action) => Tooltip(
    message: label,
    child: Material(
      color: context.mapOverlay,
      shape: CircleBorder(),
      child: InkWell(
        onTap: action,
        customBorder: CircleBorder(),
        child: SizedBox(
          width: 42,
          height: 42,
          child: Icon(icon, color: context.mapOverlayText, size: 20),
        ),
      ),
    ),
  );

  void _runMapAction(String action) {
    if (_pageReady) {
      _surface.invoke(action);
    }
  }
}

class _MapStatus extends StatelessWidget {
  const _MapStatus({
    required this.icon,
    required this.text,
    this.busy = false,
    this.onRetry,
  });

  final IconData icon;
  final String text;
  final bool busy;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => Material(
    color: context.mapOverlay,
    borderRadius: BorderRadius.circular(10),
    child: Padding(
      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (busy)
            SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: context.colors.onSurface,
              ),
            )
          else
            Icon(icon, size: 15, color: context.colors.onSurface),
          SizedBox(width: 7),
          Flexible(
            child: Text(
              text,
              style: TextStyle(color: context.mapOverlayText, fontSize: 15),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (onRetry != null) ...[
            SizedBox(width: 5),
            TextButton(
              onPressed: onRetry,
              style: TextButton.styleFrom(
                foregroundColor: context.colors.onSurface,
                padding: EdgeInsets.symmetric(horizontal: 5),
                minimumSize: Size(42, 28),
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text('Retry'),
            ),
          ],
        ],
      ),
    ),
  );
}
