import 'dart:convert';

import 'package:flutter/material.dart';

import '../data/geography_api.dart';
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
    this.onPlaceSelected,
    this.onSceneChanged,
  });

  final GeographyEntity? selectedPlace;
  final double height;
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
  bool _countyBoundariesRequested = false;
  String? _error;
  String? _warning;
  int _selectionGeneration = 0;
  String? _requestedId;
  String? _loadedId;
  GeographyScene? _scene;

  static const _ionToken = String.fromEnvironment('CESIUM_ION_TOKEN');

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
    _loadKenyanCounties();
    if (_scene != null) {
      _pushScene(_scene!);
    } else {
      _syncRequestedPlace();
    }
  }

  Future<void> _loadKenyanCounties() async {
    if (!_pageReady || _countyBoundariesRequested) return;
    _countyBoundariesRequested = true;
    if (!GeographyApiClient.instance.isConfigured) {
      if (mounted) {
        setState(() {
          _warning = 'Connect MZIZI_API_BASE_URL to load verified Kenya county boundaries.';
        });
      }
      return;
    }
    try {
      final boundaries = await GeographyApiClient.instance
          .kenyanCountyBoundaries();
      if (!mounted || !_pageReady) return;
      await _surface.invoke('setKenyanCounties', {'boundaries': boundaries});
      if (mounted) setState(() => _warning = null);
    } catch (error) {
      if (mounted) {
        setState(() {
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
    await _surface.invoke('configure', {'ionToken': _ionToken});
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

  Future<void> _loadScene(String id) async {
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
      final scene = await GeographyApiClient.instance.sceneFor(id);
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
      'focusFeature': scene.focusFeature,
      'parentBoundary': scene.parentBoundary,
      'siblingBoundaries': scene.siblingBoundaries,
      'childBoundaries': scene.childBoundaries,
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
          _loadKenyanCounties();
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
                _button(Icons.public, 'Reset to globe', _resetGlobe),
                const SizedBox(height: 6),
                _button(Icons.add, 'Zoom in', () => _runMapAction('zoomIn')),
                const SizedBox(height: 6),
                _button(
                  Icons.remove,
                  'Zoom out',
                  () => _runMapAction('zoomOut'),
                ),
              ],
            ),
          ),
          if (_loading)
            const Positioned(
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
                    : () => _loadScene(_requestedId!),
              ),
            ),
          if (_warning != null)
            Positioned(
              left: 10,
              right: 58,
              bottom: 8,
              child: _MapStatus(icon: Icons.info_outline, text: _warning!),
            ),
          if (!_pageReady)
            const ColoredBox(
              color: Color(0xFF071612),
              child: Center(
                child: CircularProgressIndicator(color: Color(0xFF76C99A)),
              ),
            ),
        ],
      ),
    ),
  );

  Widget _button(IconData icon, String label, VoidCallback action) => Tooltip(
    message: label,
    child: Material(
      color: const Color(0xE6102A24),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: action,
        customBorder: const CircleBorder(),
        child: SizedBox(
          width: 42,
          height: 42,
          child: Icon(icon, color: Colors.white, size: 20),
        ),
      ),
    ),
  );

  void _runMapAction(String action) {
    if (_pageReady) {
      _surface.invoke(action);
    }
  }

  @override
  void dispose() {
    _surface.dispose();
    super.dispose();
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
    color: const Color(0xF2102A24),
    borderRadius: BorderRadius.circular(10),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (busy)
            const SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Color(0xFFB3E0C3),
              ),
            )
          else
            Icon(icon, size: 15, color: const Color(0xFFB3E0C3)),
          const SizedBox(width: 7),
          Flexible(
            child: Text(
              text,
              style: const TextStyle(color: Colors.white, fontSize: 15),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (onRetry != null) ...[
            const SizedBox(width: 5),
            TextButton(
              onPressed: onRetry,
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xFFB3E0C3),
                padding: const EdgeInsets.symmetric(horizontal: 5),
                minimumSize: const Size(42, 28),
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: const Text('Retry'),
            ),
          ],
        ],
      ),
    ),
  );
}
