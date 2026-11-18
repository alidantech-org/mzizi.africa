import 'dart:math' as math;

import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_logo.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

/// The short in-app splash after the system one: the mark springs in with a ring of petals, the word Mzizi slides up
/// and the line under it fades in, then it hands over to Home (or onboarding the first time).
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1900),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_c.isAnimating || _c.value > 0) return;
    if (MediaQuery.disableAnimationsOf(context)) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _go());
    } else {
      _c.forward().whenComplete(
        () => Future<void>.delayed(const Duration(milliseconds: 250), _go),
      );
    }
  }

  void _go() {
    if (mounted) context.go('/');
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? const Color(0xFF261B14)
          : const Color(0xFFF6F1E7),
      body: Center(
        child: AnimatedBuilder(
          animation: _c,
          builder: (context, _) {
            final mark = Curves.elasticOut.transform(
              (_c.value / 0.55).clamp(0.0, 1.0),
            );
            final word = Curves.easeOutCubic.transform(
              ((_c.value - 0.35) / 0.4).clamp(0.0, 1.0),
            );
            final line = Curves.easeOut.transform(
              ((_c.value - 0.65) / 0.3).clamp(0.0, 1.0),
            );
            final ring = Curves.easeOutCubic.transform(
              (_c.value / 0.8).clamp(0.0, 1.0),
            );
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: 180,
                  height: 180,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      CustomPaint(
                        size: const Size(180, 180),
                        painter: _RingPainter(ring),
                      ),
                      Transform.scale(
                        scale: mark,
                        child: Transform.rotate(
                          angle: (1 - mark) * -0.5,
                          child: const MzLogoMark(size: 92),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                Opacity(
                  opacity: word,
                  child: Transform.translate(
                    offset: Offset(0, (1 - word) * 18),
                    child: Text(
                      'Mzizi',
                      style: GoogleFonts.fraunces(
                        fontSize: 44,
                        fontWeight: FontWeight.w600,
                        letterSpacing: -1,
                        color: scheme.onSurface,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Opacity(
                  opacity: line,
                  child: Text(
                    tr(uiLanguage, 'tagline'),
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter(this.t);
  final double t;
  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    for (var i = 0; i < 10; i++) {
      final a = i / 10 * math.pi * 2 - math.pi / 2;
      final r = 40 + 48 * t;
      canvas.save();
      canvas.translate(c.dx + math.cos(a) * r, c.dy + math.sin(a) * r);
      canvas.rotate(a + math.pi / 2);
      final petal = Path()
        ..moveTo(0, 0)
        ..quadraticBezierTo(5, -6, 0, -13)
        ..quadraticBezierTo(-5, -6, 0, 0);
      canvas.drawPath(
        petal,
        Paint()
          ..color = Color.lerp(
            const Color(0xFFC8582B),
            const Color(0xFFD9A13D),
            i / 10,
          )!.withValues(alpha: (1 - t * 0.6) * math.min(1, t * 3)),
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_RingPainter old) => old.t != t;
}
