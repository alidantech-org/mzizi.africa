import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

/// A one-shot burst of flower petals that rains down the screen to celebrate. It ignores touches, ends by itself and
/// is skipped when the phone asks for reduced motion.
class PetalBurst extends StatefulWidget {
  const PetalBurst({super.key, required this.onDone});
  final VoidCallback onDone;

  /// True once a burst has played in this app session (it is shown at most once).
  static bool playedThisSession = false;

  @override
  State<PetalBurst> createState() => _PetalBurstState();
}

class _Petal {
  _Petal(math.Random r)
    : x = r.nextDouble(),
      delay = r.nextDouble() * 0.35,
      speed = 0.55 + r.nextDouble() * 0.45,
      sway = 18 + r.nextDouble() * 34,
      phase = r.nextDouble() * math.pi * 2,
      size = 7 + r.nextDouble() * 9,
      spin = (r.nextDouble() - 0.5) * 9,
      colour = _palette[r.nextInt(_palette.length)];
  final double x, delay, speed, sway, phase, size, spin;
  final Color colour;
  static const _palette = [
    Color(0xFFE76F51),
    Color(0xFFF4A261),
    Color(0xFFE9C46A),
    Color(0xFFD65A87),
    Color(0xFFFFD6A5),
    Color(0xFF8AB17D),
  ];
}

class _PetalBurstState extends State<PetalBurst>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 3600),
      )..addStatusListener((s) {
        if (s == AnimationStatus.completed) widget.onDone();
      });
  final _petals = List.generate(46, (_) => _Petal(math.Random()));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      WidgetsBinding.instance.addPostFrameCallback((_) => widget.onDone());
    } else if (!_c.isAnimating && _c.value == 0) {
      _c.forward();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
    child: AnimatedBuilder(
      animation: _c,
      builder: (context, _) => CustomPaint(
        size: Size.infinite,
        painter: _PetalPainter(_petals, _c.value),
      ),
    ),
  );
}

class _PetalPainter extends CustomPainter {
  _PetalPainter(this.petals, this.t);
  final List<_Petal> petals;
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in petals) {
      final local = ((t - p.delay) / (1 - p.delay)).clamp(0.0, 1.0);
      if (local <= 0) continue;
      final y =
          -20 + (size.height + 60) * Curves.easeIn.transform(local) * p.speed;
      final x = size.width * p.x + math.sin(local * 6 + p.phase) * p.sway;
      final fade = local > 0.8 ? (1 - local) / 0.2 : 1.0;
      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(local * p.spin + p.phase);
      final petal = Path()
        ..moveTo(0, 0)
        ..cubicTo(p.size, -p.size * 0.6, p.size, -p.size * 1.6, 0, -p.size * 2)
        ..cubicTo(-p.size, -p.size * 1.6, -p.size, -p.size * 0.6, 0, 0);
      canvas.drawPath(
        petal,
        Paint()..color = p.colour.withValues(alpha: 0.92 * fade),
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_PetalPainter old) => old.t != t;
}
