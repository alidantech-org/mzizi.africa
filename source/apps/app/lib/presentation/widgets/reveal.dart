import 'package:material_ui/material_ui.dart';

/// Fades and slides its child in when first built, [order] steps after the first (a staggered entrance).
class Reveal extends StatelessWidget {
  const Reveal({super.key, required this.child, this.order = 0});

  final Widget child;
  final int order;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: Duration(milliseconds: 420 + order * 90),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) => Opacity(
        opacity: value,
        child: Transform.translate(
          offset: Offset(0, (1 - value) * 18),
          child: child,
        ),
      ),
      child: child,
    );
  }
}

/// A mudcloth-style diamond pattern for hero backgrounds.
class PatternPainter extends CustomPainter {
  const PatternPainter(this.a, this.b);

  final Color a;
  final Color b;

  @override
  void paint(Canvas canvas, Size size) {
    const step = 44.0;
    final paintA = Paint()..color = a;
    final paintB = Paint()..color = b;
    for (double y = 0; y < size.height + step; y += step) {
      for (double x = 0; x < size.width + step; x += step) {
        final even = ((x / step).round() + (y / step).round()) % 2 == 0;
        final path = Path()
          ..moveTo(x, y - 12)
          ..lineTo(x + 12, y)
          ..lineTo(x, y + 12)
          ..lineTo(x - 12, y)
          ..close();
        canvas.drawPath(path, even ? paintA : paintB);
      }
    }
  }

  @override
  bool shouldRepaint(PatternPainter old) => old.a != a || old.b != b;
}
