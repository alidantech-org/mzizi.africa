import 'dart:ui' show ImageFilter;

import 'dart:math' as math;

import 'package:flutter_map/flutter_map.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart' hide Path;
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';

/// Small helpers to read the open JSON sections of the insight documents without casts at every use.
Map<String, dynamic> asMap(Object? value) =>
    value is Map ? Map<String, dynamic>.from(value) : const {};
List<Map<String, dynamic>> asMaps(Object? value) => value is List
    ? [
        for (final item in value)
          if (item is Map) Map<String, dynamic>.from(item),
      ]
    : const [];
double? asNum(Object? value) => value is num ? value.toDouble() : null;
String asText(Object? value, [String fallback = '']) =>
    value == null ? fallback : '$value';

String compact(num? value) {
  if (value == null) return '—';
  final v = value.toDouble();
  if (v.abs() >= 1e9) return '${(v / 1e9).toStringAsFixed(1)}B';
  if (v.abs() >= 1e6) return '${(v / 1e6).toStringAsFixed(1)}M';
  if (v.abs() >= 1e3)
    return '${(v / 1e3).toStringAsFixed(v.abs() >= 1e4 ? 0 : 1)}K';
  return v == v.roundToDouble() ? v.toStringAsFixed(0) : v.toStringAsFixed(1);
}

String ksh(num? value) => value == null ? '—' : 'KSh ${compact(value)}';
String pct(num? fraction, [int digits = 1]) =>
    fraction == null ? '—' : '${(fraction * 100).toStringAsFixed(digits)}%';
String words(String code) {
  final text = code.replaceAll('-', ' ');
  return text.isEmpty ? text : text[0].toUpperCase() + text.substring(1);
}

Color toneColor(String? status) => switch (status) {
  'completed' ||
  'complete' ||
  'awarded' ||
  'passed' ||
  'yes' => MziziTokens.raffia,
  'ongoing' || 'open' => MziziTokens.indigo,
  'planned' || 'evaluation' || 'abstain' => MziziTokens.calabash,
  'stalled' || 'cancelled' || 'rejected' || 'no' => MziziTokens.danger,
  _ => MziziTokens.inkSoft,
};

/// A translucent surface with a bright rim over a blurred backdrop: the mobile form of the site's glass.
class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.onTap,
    this.margin = EdgeInsets.zero,
  });
  final Widget child;
  final EdgeInsets padding;
  final EdgeInsets margin;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final fill = dark ? MziziTokens.glassDark : MziziTokens.glass;
    final edge = dark ? MziziTokens.glassEdgeDark : MziziTokens.glassEdge;
    return Padding(
      padding: margin,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
          child: Material(
            color: fill,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(22),
              side: BorderSide(color: edge),
            ),
            child: InkWell(
              onTap: onTap,
              child: Padding(padding: padding, child: child),
            ),
          ),
        ),
      ),
    );
  }
}

/// A page frame: scrolling content with the standard gutter and bottom space for the navigation bar.
class PageFrame extends StatelessWidget {
  const PageFrame({super.key, required this.children, this.crumbs = const []});
  final List<Widget> children;
  final List<({String label, String? path})> crumbs;

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
    children: [
      if (crumbs.isNotEmpty) Crumbs(items: crumbs),
      ...children,
    ],
  );
}

/// Where you are; every level but the last is a link. Long trails scroll sideways.
class Crumbs extends StatelessWidget {
  const Crumbs({super.key, required this.items});
  final List<({String label, String? path})> items;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    padding: const EdgeInsets.only(bottom: 8),
    child: Row(
      children: [
        for (var i = 0; i < items.length; i++) ...[
          if (i > 0)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 4),
              child: Text('›'),
            ),
          items[i].path != null && i < items.length - 1
              ? InkWell(
                  borderRadius: BorderRadius.circular(8),
                  onTap: () => context.go(items[i].path!),
                  child: Padding(
                    padding: const EdgeInsets.all(4),
                    child: Text(
                      items[i].label,
                      style: const TextStyle(
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(4),
                  child: Text(
                    items[i].label,
                    style: TextStyle(
                      fontWeight: i == items.length - 1
                          ? FontWeight.w700
                          : FontWeight.w400,
                    ),
                  ),
                ),
        ],
      ],
    ),
  );
}

class Heading extends StatelessWidget {
  const Heading(this.title, {super.key, this.kicker});
  final String title;
  final String? kicker;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 22, bottom: 10),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (kicker != null)
          Text(
            kicker!.toUpperCase(),
            style: const TextStyle(
              color: MziziTokens.clay,
              fontSize: 11,
              letterSpacing: 1.4,
              fontWeight: FontWeight.w700,
            ),
          ),
        Text(
          title,
          style: Theme.of(
            context,
          ).textTheme.headlineSmall?.copyWith(fontFamily: 'Georgia'),
        ),
      ],
    ),
  );
}

class StatTile extends StatelessWidget {
  const StatTile({
    super.key,
    required this.label,
    required this.value,
    this.hint,
    this.color,
  });
  final String label;
  final String value;
  final String? hint;
  final Color? color;
  @override
  Widget build(BuildContext context) => GlassCard(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: Theme.of(context).textTheme.labelSmall?.copyWith(
            letterSpacing: 1,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontFamily: 'Georgia',
            color: color,
          ),
        ),
        if (hint != null)
          Text(hint!, style: Theme.of(context).textTheme.bodySmall),
      ],
    ),
  );
}

/// A two-column grid of tiles that stays two columns on phones.
class TileGrid extends StatelessWidget {
  const TileGrid({super.key, required this.children});
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Wrap(
    spacing: 10,
    runSpacing: 10,
    children: [
      for (final c in children)
        SizedBox(width: (MediaQuery.sizeOf(context).width - 42) / 2, child: c),
    ],
  );
}

class Pill extends StatelessWidget {
  const Pill(this.label, {super.key, this.color});
  final String label;
  final Color? color;
  @override
  Widget build(BuildContext context) {
    final c = color ?? MziziTokens.inkSoft;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: c.withValues(alpha: 0.4)),
      ),
      child: Text(
        label,
        style: TextStyle(color: c, fontSize: 12, fontWeight: FontWeight.w600),
      ),
    );
  }
}

/// What is missing, with two ways forward: ask for it or check the official source. Opens deeper detail in a sheet.
class GapsNote extends StatelessWidget {
  const GapsNote({super.key, required this.items, this.topic = 'missing data'});
  final List<Object?> items;
  final String topic;
  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();
    return GlassCard(
      margin: const EdgeInsets.only(top: 22),
      onTap: () => showInfoSheet(
        context,
        title: 'Not available yet',
        builder: (_) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (final item in items)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Text('• $item'),
              ),
            const SizedBox(height: 8),
            FilledButton.icon(
              onPressed: () => Navigator.of(context).pop(),
              icon: MzIcon('mail'),
              label: Text('Ask for this data: $topic'),
            ),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                context.go('/source-browse');
              },
              icon: MzIcon('book'),
              label: const Text('Check the official sources yourself'),
            ),
          ],
        ),
      ),
      child: Row(
        children: [
          MzIcon('info', color: MziziTokens.calabash),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              '${items.length} thing${items.length == 1 ? '' : 's'} not available yet. Tap to see what, and how to ask.',
            ),
          ),
        ],
      ),
    );
  }
}

/// The modal bottom-sheet shell every deep or miscellaneous detail opens in (no dialogs on phones): a drag handle, a title,
/// scrollable content and a snap from half to full height.
Future<void> showInfoSheet(
  BuildContext context, {
  required String title,
  required WidgetBuilder builder,
  double initial = 0.55,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: Colors.transparent,
    builder: (sheetContext) => DraggableScrollableSheet(
      expand: false,
      initialChildSize: initial,
      minChildSize: 0.3,
      maxChildSize: 0.95,
      builder: (context, controller) {
        final dark = Theme.of(context).brightness == Brightness.dark;
        return ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              decoration: BoxDecoration(
                color: dark
                    ? MziziTokens.glassStrongDark
                    : MziziTokens.glassStrong,
                border: Border(
                  top: BorderSide(
                    color: dark
                        ? MziziTokens.glassEdgeDark
                        : MziziTokens.glassEdge,
                  ),
                ),
              ),
              child: ListView(
                controller: controller,
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 32),
                children: [
                  Center(
                    child: Container(
                      width: 44,
                      height: 5,
                      margin: const EdgeInsets.only(bottom: 14),
                      decoration: BoxDecoration(
                        color: MziziTokens.inkSoft.withValues(alpha: 0.4),
                        borderRadius: BorderRadius.circular(9),
                      ),
                    ),
                  ),
                  Text(
                    title,
                    style: Theme.of(
                      context,
                    ).textTheme.titleLarge?.copyWith(fontFamily: 'Georgia'),
                  ),
                  const SizedBox(height: 14),
                  builder(sheetContext),
                ],
              ),
            ),
          ),
        );
      },
    ),
  );
}

/// Horizontal bars for a short ranked list.
class BarList extends StatelessWidget {
  const BarList({super.key, required this.items, this.format = compact});
  final List<({String label, double value, String? note})> items;
  final String Function(num?) format;
  @override
  Widget build(BuildContext context) {
    final top = items.fold<double>(1e-9, (a, b) => math.max(a, b.value));
    return Column(
      children: [
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 9),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(item.label, overflow: TextOverflow.ellipsis),
                    ),
                    Text(
                      '${format(item.value)}${item.note == null ? '' : ' · ${item.note}'}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                ClipRRect(
                  borderRadius: BorderRadius.circular(9),
                  child: LinearProgressIndicator(
                    value: (item.value / top).clamp(0.02, 1.0),
                    minHeight: 8,
                    color: MziziTokens.clay,
                    backgroundColor: MziziTokens.clay.withValues(alpha: 0.12),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

/// A line chart of a short series (the sparkline's bigger sibling).
class SeriesChart extends StatelessWidget {
  const SeriesChart({
    super.key,
    required this.values,
    required this.labels,
    this.height = 150,
  });
  final List<double> values;
  final List<String> labels;
  final double height;
  @override
  Widget build(BuildContext context) => SizedBox(
    height: height,
    width: double.infinity,
    child: CustomPaint(
      painter: _SeriesPainter(
        values,
        labels,
        Theme.of(context).textTheme.bodySmall?.color ?? MziziTokens.inkSoft,
      ),
    ),
  );
}

class _SeriesPainter extends CustomPainter {
  _SeriesPainter(this.values, this.labels, this.ink);
  final List<double> values;
  final List<String> labels;
  final Color ink;
  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    final lo = values.reduce(math.min), hi = values.reduce(math.max);
    final span = (hi - lo) == 0 ? 1 : hi - lo;
    const pad = 22.0;
    Offset at(int i) => Offset(
      8 + i * (size.width - 16) / (values.length - 1),
      pad + (1 - (values[i] - lo) / span) * (size.height - pad * 2),
    );
    final path = Path()..moveTo(at(0).dx, at(0).dy);
    for (var i = 1; i < values.length; i++) {
      path.lineTo(at(i).dx, at(i).dy);
    }
    final fill = Path.from(path)
      ..lineTo(at(values.length - 1).dx, size.height - pad)
      ..lineTo(at(0).dx, size.height - pad)
      ..close();
    canvas.drawPath(
      fill,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            MziziTokens.clay.withValues(alpha: 0.35),
            MziziTokens.clay.withValues(alpha: 0),
          ],
        ).createShader(Offset.zero & size),
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = MziziTokens.clay
        ..strokeWidth = 2.6
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round,
    );
    canvas.drawCircle(
      at(values.length - 1),
      5,
      Paint()..color = MziziTokens.clay,
    );
    for (final i in {0, values.length ~/ 2, values.length - 1}) {
      final tp = TextPainter(
        text: TextSpan(
          text: labels[i],
          style: TextStyle(color: ink, fontSize: 10),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(
        canvas,
        Offset(
          (at(i).dx - tp.width / 2).clamp(0, size.width - tp.width),
          size.height - 14,
        ),
      );
    }
  }

  @override
  bool shouldRepaint(_SeriesPainter old) => old.values != values;
}

/// Every member as a dot on concentric arcs; colour is the position taken. Tap a dot for the member.
class Hemicycle extends StatelessWidget {
  const Hemicycle({super.key, required this.members, this.onSelect});
  final List<Map<String, dynamic>> members;
  final void Function(Map<String, dynamic>)? onSelect;
  static const colors = {
    'yes': MziziTokens.raffia,
    'no': MziziTokens.danger,
    'abstain': MziziTokens.calabash,
    'absent': Color(0xFFB8B2A8),
  };

  List<Offset> _seats(int count, Size size) {
    final rows = math.max(2, math.sqrt(count / 3.2).round());
    final radii = [
      for (var i = 0; i < rows; i++) 0.38 + i * 0.62 / math.max(1, rows - 1),
    ];
    final total = radii.reduce((a, b) => a + b);
    final seats = <({double angle, double r})>[];
    for (var i = 0; i < rows; i++) {
      final n = i == rows - 1
          ? count - seats.length
          : (count * radii[i] / total).round();
      for (var k = 0; k < n; k++) {
        seats.add((angle: math.pi * (n == 1 ? 0.5 : k / (n - 1)), r: radii[i]));
      }
    }
    seats.sort(
      (a, b) => b.angle.compareTo(a.angle) != 0
          ? b.angle.compareTo(a.angle)
          : a.r.compareTo(b.r),
    );
    final cx = size.width / 2,
        base = size.height - 8,
        radius = math.min(cx - 8, base - 8);
    return [
      for (final s in seats)
        Offset(
          cx - math.cos(s.angle) * s.r * radius,
          base - math.sin(s.angle) * s.r * radius,
        ),
    ];
  }

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, box) {
      final size = Size(box.maxWidth, box.maxWidth * 0.56);
      final seats = _seats(members.length, size);
      final dot = members.length > 200
          ? 2.6
          : members.length > 60
          ? 4.0
          : 6.0;
      return GestureDetector(
        onTapUp: (d) {
          var best = -1;
          var distance = 1e9;
          for (var i = 0; i < seats.length; i++) {
            final dd = (seats[i] - d.localPosition).distance;
            if (dd < distance) {
              distance = dd;
              best = i;
            }
          }
          if (best >= 0 && distance < 18) onSelect?.call(members[best]);
        },
        child: SizedBox(
          width: size.width,
          height: size.height,
          child: CustomPaint(
            painter: _HemiPainter(seats, [
              for (final m in members)
                colors[asText(m['position'])] ?? MziziTokens.inkSoft,
            ], dot),
          ),
        ),
      );
    },
  );
}

class _HemiPainter extends CustomPainter {
  _HemiPainter(this.seats, this.colors, this.dot);
  final List<Offset> seats;
  final List<Color> colors;
  final double dot;
  @override
  void paint(Canvas canvas, Size size) {
    for (var i = 0; i < seats.length; i++) {
      canvas.drawCircle(seats[i], dot, Paint()..color = colors[i]);
    }
  }

  @override
  bool shouldRepaint(_HemiPainter old) => old.seats.length != seats.length;
}

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
  final c = geometry['coordinates'];
  return switch (geometry['type']) {
    'Polygon' => [polygon(c)],
    'MultiPolygon' => [for (final p in (c as List)) polygon(p)],
    _ => const [],
  };
}

/// A heat map: regions filled by a colour you decide, each tappable. Tiles stay faint beneath the fills.
class RegionMap extends StatefulWidget {
  const RegionMap({
    super.key,
    required this.regions,
    this.onTap,
    this.height = 300,
  });
  final List<({String id, String name, Object? geometry, Color fill})> regions;
  final void Function(String id)? onTap;
  final double height;
  @override
  State<RegionMap> createState() => _RegionMapState();
}

class _RegionMapState extends State<RegionMap> {
  final _controller = MapController();
  @override
  Widget build(BuildContext context) {
    final polygons = <Polygon<String>>[];
    final points = <LatLng>[];
    for (final r in widget.regions) {
      for (final p in _polygons(r.geometry)) {
        polygons.add(
          Polygon<String>(
            points: p.first,
            holePointsList: p.length > 1 ? p.sublist(1) : null,
            color: r.fill.withValues(alpha: 0.85),
            borderColor: Colors.black38,
            borderStrokeWidth: 0.6,
            hitValue: r.id,
          ),
        );
        points.addAll(p.first);
      }
    }
    final bounds = points.isEmpty ? null : LatLngBounds.fromPoints(points);
    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: SizedBox(
        height: widget.height,
        child: FlutterMap(
          mapController: _controller,
          options: MapOptions(
            initialCameraFit: bounds == null
                ? null
                : CameraFit.bounds(
                    bounds: bounds,
                    padding: const EdgeInsets.all(14),
                  ),
            initialCenter: const LatLng(0.5, 38),
            initialZoom: 5.2,
            interactionOptions: const InteractionOptions(
              flags:
                  InteractiveFlag.drag |
                  InteractiveFlag.pinchZoom |
                  InteractiveFlag.doubleTapZoom,
            ),
            onTap: (_, __) {
              final result = _hit.value;
              if (result != null && result.hitValues.isNotEmpty)
                widget.onTap?.call(result.hitValues.first);
            },
          ),
          children: [
            Opacity(
              opacity: 0.45,
              child: TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'africa.mzizi.app',
              ),
            ),
            PolygonLayer<String>(polygons: polygons, hitNotifier: _hit),
          ],
        ),
      ),
    );
  }

  final _hit = ValueNotifier<LayerHitResult<String>?>(null);
}
