import 'package:flutter/services.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_marker_cluster/flutter_map_marker_cluster.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart' hide Path;
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

/// The map's base tiles. OpenStreetMap tiles are light, so in dark mode they are inverted and warmed to sit in the page.
class MapTiles extends StatelessWidget {
  const MapTiles({super.key, this.opacity = 1});
  final double opacity;
  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final layer = Opacity(
      opacity: opacity,
      child: TileLayer(
        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        userAgentPackageName: 'africa.mzizi.app',
      ),
    );
    if (!dark) return layer;
    return ColorFiltered(
      colorFilter: const ColorFilter.matrix(<double>[
        -0.62, 0, 0, 0, 255 * 0.88, //
        0, -0.62, 0, 0, 255 * 0.86,
        0, 0, -0.62, 0, 255 * 0.82,
        0, 0, 0, 1, 0,
      ]),
      child: layer,
    );
  }
}

/// A rounded, tall map with the controls people expect on a phone: zoom in and out, fit everything, "where am I", and a
/// button that opens the same map full screen. Put a [legend] (small widget) in the corner when colours need a key.
class MapFrame extends StatelessWidget {
  const MapFrame({
    super.key,
    required this.controller,
    required this.map,
    this.bounds,
    this.legend,
    this.onExpand,
    this.height = 340,
    this.radius = 24,
  });
  final MapController controller;
  final Widget map;
  final LatLngBounds? bounds;
  final Widget? legend;
  final VoidCallback? onExpand;
  final double height;
  final double radius;

  Future<void> _locate(BuildContext context) async {
    try {
      var p = await Geolocator.checkPermission();
      if (p == LocationPermission.denied) {
        p = await Geolocator.requestPermission();
      }
      if (p == LocationPermission.denied ||
          p == LocationPermission.deniedForever) {
        throw StateError('denied');
      }
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.low,
          timeLimit: Duration(seconds: 10),
        ),
      );
      controller.move(LatLng(pos.latitude, pos.longitude), 12);
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              t(
                context,
                'We could not read your location. You can allow it in settings, or search for your place below.',
              ),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget button(String icon, String label, VoidCallback onTap) => Material(
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.92),
      shape: const CircleBorder(),
      elevation: 2,
      child: IconButton(
        tooltip: label,
        icon: MzIcon(icon, size: 20),
        onPressed: () {
          HapticFeedback.selectionClick();
          onTap();
        },
      ),
    );
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: SizedBox(
        height: height,
        child: Stack(
          children: [
            Positioned.fill(child: map),
            Positioned(
              right: 10,
              top: 10,
              child: Column(
                children: [
                  if (onExpand != null)
                    button('expand', t(context, 'Full screen'), onExpand!),
                  button(
                    'plus',
                    t(context, 'Zoom in'),
                    () => controller.move(
                      controller.camera.center,
                      (controller.camera.zoom + 1).clamp(1.0, 19.0),
                    ),
                  ),
                  button(
                    'minus',
                    t(context, 'Zoom out'),
                    () => controller.move(
                      controller.camera.center,
                      (controller.camera.zoom - 1).clamp(1.0, 19.0),
                    ),
                  ),
                  if (bounds != null)
                    button(
                      'fit',
                      t(context, 'Show everything'),
                      () => controller.fitCamera(
                        CameraFit.bounds(
                          bounds: bounds!,
                          padding: const EdgeInsets.all(24),
                          maxZoom: 15,
                        ),
                      ),
                    ),
                  button(
                    'locate',
                    t(context, 'My location'),
                    () => _locate(context),
                  ),
                ],
              ),
            ),
            if (legend != null)
              Positioned(
                left: 10,
                bottom: 10,
                child: Material(
                  color: Theme.of(
                    context,
                  ).colorScheme.surface.withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(14),
                  child: Padding(
                    padding: const EdgeInsets.all(8),
                    child: legend,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// A pin that tapping selects; clusters merge nearby pins into a counted bubble.
class ClusteredPins extends StatelessWidget {
  const ClusteredPins({super.key, required this.markers});
  final List<Marker> markers;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return MarkerClusterLayerWidget(
      options: MarkerClusterLayerOptions(
        maxClusterRadius: 52,
        size: const Size(44, 44),
        markers: markers,
        builder: (context, list) => Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: scheme.primary,
            border: Border.all(color: Colors.white, width: 2.5),
            boxShadow: const [
              BoxShadow(blurRadius: 6, color: Color(0x44000000)),
            ],
          ),
          alignment: Alignment.center,
          child: Text(
            '${list.length}',
            style: TextStyle(
              color: scheme.onPrimary,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ),
    );
  }
}

/// A scrolling page that holds one map filling the screen, for when the small map is not enough room.
class FullMapPage extends StatefulWidget {
  const FullMapPage({super.key, required this.title, required this.builder});
  final String title;
  final Widget Function(BuildContext context, MapController controller) builder;
  @override
  State<FullMapPage> createState() => _FullMapPageState();
}

class _FullMapPageState extends State<FullMapPage> {
  final _controller = MapController();
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        leading: IconButton(
          icon: MzIcon('close'),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: LayoutBuilder(
        builder: (context, box) => MapFrame(
          controller: _controller,
          map: widget.builder(context, _controller),
          height: box.maxHeight,
          radius: 0,
        ),
      ),
    );
  }
}
