import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../data/geography_api.dart';

/// A database-backed, flat county map. Colors only distinguish adjacent areas.
class CountyChoroplethMap extends StatefulWidget {
  const CountyChoroplethMap({
    super.key,
    this.selectedPlace,
    this.apiClient,
    required this.onPlaceSelected,
  });

  final GeographyEntity? selectedPlace;
  final GeographyApiClient? apiClient;
  final ValueChanged<GeographyEntity> onPlaceSelected;

  @override
  State<CountyChoroplethMap> createState() => _CountyChoroplethMapState();
}

class _CountyChoroplethMapState extends State<CountyChoroplethMap> {
  GeographyApiClient get _api => widget.apiClient ?? GeographyApiClient.instance;
  GeographyFeatureCollection? _collection;
  Object? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final collection = await _api.initialBoundaries();
      if (!mounted) return;
      setState(() {
        _collection = collection;
        _loading = false;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _error = error;
        _loading = false;
      });
    }
  }

  Future<void> _select(GeographyFeature feature) async {
    try {
      final entity = await _api.entity(
        feature.properties.geographyId,
      );
      if (mounted) widget.onPlaceSelected(entity);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not open this place: $error')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.outlineVariant),
      ),
      clipBehavior: Clip.antiAlias,
      child: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? _message(
              icon: Icons.cloud_off_outlined,
              title: _isNetworkFailure(_error!)
                  ? 'Mzizi API is unavailable'
                  : 'Could not load county boundaries',
              description: _errorDescription(_error!),
              action: FilledButton.tonalIcon(
                onPressed: _load,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            )
          : _collection!.features.where(_hasPolygon).isEmpty
          ? _message(
              icon: Icons.map_outlined,
              title: 'No verified county boundaries available',
              description: 'The API returned no usable county polygons. Import and verify sourced GeoJSON boundaries before the map can draw them.',
            )
          : LayoutBuilder(
              builder: (context, constraints) {
                final features = _collection!.features
                    .where(_hasPolygon)
                    .toList();
                final painter = _CountyMapPainter(
                  features: features,
                  selectedId: widget.selectedPlace?.id,
                  borderColor: colors.surface,
                  outlineColor: colors.primary,
                );
                return Stack(
                  children: [
                    Positioned.fill(
                      child: GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTapUp: (event) {
                          final local = event.localPosition;
                          final index = painter.featureAt(local);
                          if (index != null) _select(features[index]);
                        },
                        child: CustomPaint(painter: painter),
                      ),
                    ),
                    Positioned(
                      left: 12,
                      bottom: 12,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: colors.surface.withValues(alpha: .94),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: colors.outlineVariant),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 11,
                            vertical: 7,
                          ),
                          child: Text(
                            'Verified county boundaries · Colors distinguish areas',
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
    );
  }

  /// A compact scrollable state panel: the Explore preview is only 230px tall.
  /// Never hide network or no-data diagnostics behind a RenderFlex overflow.
  Widget _message({
    required IconData icon,
    required String title,
    required String description,
    Widget? action,
  }) => LayoutBuilder(
    builder: (context, constraints) => SingleChildScrollView(
      child: ConstrainedBox(
        constraints: BoxConstraints(minHeight: constraints.maxHeight),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 22, color: Theme.of(context).colorScheme.onSurfaceVariant),
                const SizedBox(height: 5),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    height: 1.3,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                if (action != null) ...[const SizedBox(height: 7), action],
              ],
            ),
          ),
        ),
      ),
    ),
  );

  bool _isNetworkFailure(Object error) {
    final message = error.toString().toLowerCase();
    return message.contains('clientexception') ||
        message.contains('failed to fetch') ||
        message.contains('connection refused') ||
        message.contains('socketexception');
  }

  String _errorDescription(Object error) {
    if (_isNetworkFailure(error)) {
      final baseUrl = _api.apiBaseUrl;
      return 'Cannot reach $baseUrl. Start NestJS and its database. '
          'On a physical phone, pass a reachable server IP using '
          '--dart-define=MZIZI_API_BASE_URL=http://YOUR-LAN-IP:3000. '
          'For Flutter Web, also allow the app origin in API CORS.';
    }
    return error
        .toString()
        .replaceFirst('Exception: ', '')
        .replaceFirst('Bad state: ', '');
  }
}

bool _hasPolygon(GeographyFeature feature) =>
    feature.geometry['type'] == 'Polygon' ||
    feature.geometry['type'] == 'MultiPolygon';

class _CountyMapPainter extends CustomPainter {
  _CountyMapPainter({
    required this.features,
    required this.selectedId,
    required this.borderColor,
    required this.outlineColor,
  });

  final List<GeographyFeature> features;
  final String? selectedId;
  final Color borderColor;
  final Color outlineColor;
  static const _palette = [
    Color(0xFF83A96E),
    Color(0xFFE6B84F),
    Color(0xFFC76E67),
    Color(0xFF6FA7B4),
    Color(0xFFA17AA1),
    Color(0xFF9CBA67),
    Color(0xFFE39A46),
    Color(0xFF79A984),
    Color(0xFFC98B73),
    Color(0xFF82A1C1),
  ];

  List<List<List<List<num>>>> _polygons(GeographyFeature feature) {
    final coordinates = feature.geometry['coordinates'];
    if (coordinates is! List) return const [];
    if (feature.geometry['type'] == 'Polygon') {
      return [_rings(coordinates)];
    }
    return coordinates.whereType<List>().map(_rings).toList();
  }

  List<List<List<num>>> _rings(List<dynamic> polygon) => polygon
      .whereType<List>()
      .map(
        (ring) => ring
            .whereType<List>()
            .where(
              (point) =>
                  point.length >= 2 && point[0] is num && point[1] is num,
            )
            .map((point) => [point[0] as num, point[1] as num])
            .toList(),
      )
      .where((ring) => ring.length >= 3)
      .toList();

  @override
  void paint(Canvas canvas, Size size) {
    final all = <List<num>>[];
    for (final feature in features) {
      for (final polygon in _polygons(feature)) {
        if (polygon.isNotEmpty) all.addAll(polygon.first);
      }
    }
    if (all.isEmpty || size.isEmpty) return;
    final minLon = all.map((point) => point[0].toDouble()).reduce(_min);
    final maxLon = all.map((point) => point[0].toDouble()).reduce(_max);
    final minLat = all.map((point) => point[1].toDouble()).reduce(_min);
    final maxLat = all.map((point) => point[1].toDouble()).reduce(_max);
    final lonScale = math.cos(((minLat + maxLat) / 2) * math.pi / 180);
    final lonRange = (maxLon - minLon) * lonScale;
    final latRange = maxLat - minLat;
    if (lonRange <= 0 || latRange <= 0) return;
    const padding = 18.0;
    final scale = _min(
      (size.width - padding * 2) / lonRange,
      (size.height - padding * 2) / latRange,
    );
    final drawnWidth = lonRange * scale;
    final drawnHeight = latRange * scale;
    final left = (size.width - drawnWidth) / 2;
    final top = (size.height - drawnHeight) / 2;
    Offset project(List<num> point) => Offset(
      left + (point[0].toDouble() - minLon) * lonScale * scale,
      top + (maxLat - point[1].toDouble()) * scale,
    );

    final paths = <Path>[];
    for (var i = 0; i < features.length; i++) {
      final path = Path()..fillType = PathFillType.evenOdd;
      for (final polygon in _polygons(features[i])) {
        for (final ring in polygon) {
          if (ring.length < 3) continue;
          path.moveTo(project(ring.first).dx, project(ring.first).dy);
          for (final point in ring.skip(1)) {
            final offset = project(point);
            path.lineTo(offset.dx, offset.dy);
          }
          path.close();
        }
      }
      paths.add(path);
      final fill = Paint()
        ..color = _palette[_stableIndex(features[i].properties.geographyId)]
        ..style = PaintingStyle.fill;
      canvas.drawPath(path, fill);
      canvas.drawPath(
        path,
        Paint()
          ..color = borderColor
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.6,
      );
      if (features[i].properties.geographyId == selectedId) {
        canvas.drawPath(
          path,
          Paint()
            ..color = outlineColor
            ..style = PaintingStyle.stroke
            ..strokeWidth = 3,
        );
      }
    }
    _paths = paths;
  }

  List<Path> _paths = const [];

  int? featureAt(Offset point) {
    for (var i = _paths.length - 1; i >= 0; i--) {
      if (_paths[i].contains(point)) return i;
    }
    return null;
  }

  @override
  bool shouldRepaint(covariant _CountyMapPainter oldDelegate) =>
      oldDelegate.features != features ||
      oldDelegate.selectedId != selectedId ||
      oldDelegate.borderColor != borderColor ||
      oldDelegate.outlineColor != outlineColor;
}

double _min(double a, double b) => a < b ? a : b;
double _max(double a, double b) => a > b ? a : b;

int _stableIndex(String id) {
  var hash = 0;
  for (final unit in id.codeUnits) {
    hash = (hash * 31 + unit) & 0x7fffffff;
  }
  return hash % _CountyMapPainter._palette.length;
}
