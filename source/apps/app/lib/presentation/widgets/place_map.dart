import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';

/// One unit of the chain; the last one is the place and is drawn boldest.
class MapUnit {
  const MapUnit({required this.featureId, required this.name});

  final String featureId;
  final String name;
}

/// The rings of a GeoJSON Polygon or MultiPolygon as lists of points (outer ring first, then holes).
List<List<List<LatLng>>> _polygons(Object? geometry) {
  if (geometry is! Map) return const [];
  List<LatLng> ring(Object? raw) => [
    for (final pair in (raw as List))
      LatLng(
        ((pair as List)[1] as num).toDouble(),
        (pair[0] as num).toDouble(),
      ),
  ];
  List<List<LatLng>> polygon(Object? raw) => [
    for (final r in (raw as List)) ring(r),
  ];
  final coordinates = geometry['coordinates'];
  return switch (geometry['type']) {
    'Polygon' => [polygon(coordinates)],
    'MultiPolygon' => [for (final p in (coordinates as List)) polygon(p)],
    _ => const [],
  };
}

/// An interactive map of a place: its outline, the unit above it dashed in the colour of the bark, tiles that
/// follow the colour scheme and a pulsing marker where the visitor is. Hand-built.
class PlaceMap extends StatefulWidget {
  const PlaceMap({
    super.key,
    required this.units,
    this.position,
    this.height = 260,
  });

  final List<MapUnit> units;
  final LatLng? position;
  final double height;

  @override
  State<PlaceMap> createState() => _PlaceMapState();
}

class _PlaceMapState extends State<PlaceMap>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ping = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1800),
  )..repeat();
  final _controller = MapController();
  List<MapOutline> _outlines = const [];
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _ping.dispose();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      await _loadOutlines();
    } catch (error) {
      debugPrint('map outline failed: $error');
      if (mounted) setState(() => _loaded = true);
    }
  }

  Future<void> _loadOutlines() async {
    final shown = widget.units.length > 2
        ? widget.units.sublist(widget.units.length - 2)
        : widget.units;
    final results = await Future.wait([
      for (final unit in shown)
        GeographyFeature(
          MziziApi.connection,
        ).listFeatureGeometries(featureId: unit.featureId),
    ]);
    final outlines = <MapOutline>[];
    for (var i = 0; i < shown.length; i++) {
      final first = results[i].dataOrNull?.geometries.firstOrNull;
      if (first != null) {
        outlines.add(
          MapOutline(
            shown[i].name,
            _polygons(first.geometry),
            i == shown.length - 1,
          ),
        );
      }
    }
    if (!mounted) return;
    setState(() {
      _outlines = outlines;
      _loaded = true;
    });
    final points = [
      for (final o in outlines)
        for (final p in o.polygons) ...p.first,
      ?widget.position,
    ];
    if (points.length > 1) {
      // Wait for the entrance animation and layout so the camera fits the final size.
      Future<void>.delayed(const Duration(milliseconds: 700), () {
        if (!mounted) return;
        _controller.fitCamera(
          CameraFit.bounds(
            bounds: LatLngBounds.fromPoints(points),
            padding: const EdgeInsets.all(28),
            maxZoom: 15,
          ),
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: SizedBox(
        height: widget.height,
        child: Stack(
          children: [
            FlutterMap(
              mapController: _controller,
              options: MapOptions(
                initialCenter: widget.position ?? const LatLng(0.5, 38),
                initialZoom: widget.position != null ? 12 : 5,
                interactionOptions: const InteractionOptions(
                  flags:
                      InteractiveFlag.drag |
                      InteractiveFlag.pinchZoom |
                      InteractiveFlag.doubleTapZoom,
                ),
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  tileBuilder: dark ? darkModeTileBuilder : null,
                  userAgentPackageName: 'org.alidantech.mzizi',
                ),
                PolygonLayer(
                  polygons: [
                    for (final outline in _outlines)
                      for (final rings in outline.polygons)
                        Polygon(
                          points: rings.first,
                          holePointsList: rings.length > 1
                              ? rings.sublist(1)
                              : null,
                          color: outline.place
                              ? MziziTokens.clay.withValues(alpha: 0.28)
                              : Colors.transparent,
                          borderColor: outline.place
                              ? MziziTokens.clay
                              : MziziTokens.calabash,
                          borderStrokeWidth: outline.place ? 3 : 1.5,
                          pattern: outline.place
                              ? const StrokePattern.solid()
                              : StrokePattern.dashed(segments: const [6, 6]),
                        ),
                  ],
                ),
                if (widget.position != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: widget.position!,
                        width: 44,
                        height: 44,
                        child: AnimatedBuilder(
                          animation: _ping,
                          builder: (context, _) => Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                width: 18 + 26 * _ping.value,
                                height: 18 + 26 * _ping.value,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: MziziTokens.clay.withValues(
                                    alpha: 0.5 * (1 - _ping.value),
                                  ),
                                ),
                              ),
                              Container(
                                width: 18,
                                height: 18,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: MziziTokens.clay,
                                  border: Border.all(
                                    color: MziziTokens.cream,
                                    width: 3,
                                  ),
                                  boxShadow: const [
                                    BoxShadow(
                                      color: Colors.black38,
                                      blurRadius: 6,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                const RichAttributionWidget(
                  alignment: AttributionAlignment.bottomLeft,
                  attributions: [
                    TextSourceAttribution('OpenStreetMap contributors'),
                    TextSourceAttribution('CARTO'),
                  ],
                ),
              ],
            ),
            if (!_loaded)
              const Positioned.fill(
                child: ColoredBox(
                  color: Color(0x33000000),
                  child: Center(child: CircularProgressIndicator()),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// A unit's outline as polygons of rings.
class MapOutline {
  const MapOutline(this.name, this.polygons, this.place);

  final String name;
  final List<List<List<LatLng>>> polygons;
  final bool place;
}
