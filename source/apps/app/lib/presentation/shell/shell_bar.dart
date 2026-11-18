import 'dart:math' as math;

import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/shell/app_shell.dart';

/// Four plain tabs around the docked, stationary trophy
/// button for the leaderboard. The trophy has no text; it carries a screen-reader label.
class ShellBar extends StatelessWidget {
  const ShellBar({super.key, required this.selected, required this.onSelect});
  final int selected;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return BottomAppBar(
      shape: const CircularNotchedRectangle(),
      notchMargin: 9,
      padding: EdgeInsets.zero,
      height: 64,
      color: Theme.of(context).brightness == Brightness.dark
          ? scheme.surfaceContainer
          : scheme.surface,
      child: Row(
        children: [
          for (var i = 0; i < shellTabs.length; i++)
            Expanded(
              child: i == 2
                  ? const SizedBox.shrink()
                  : _Tab(
                      tab: shellTabs[i],
                      selected: selected == i,
                      onTap: () {
                        HapticFeedback.selectionClick();
                        onSelect(i);
                      },
                    ),
            ),
        ],
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  const _Tab({required this.tab, required this.selected, required this.onTap});
  final ShellTab tab;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final colour = selected
        ? scheme.onSurface
        : scheme.onSurface.withValues(alpha: 0.55);
    return InkResponse(
      onTap: onTap,
      radius: 32,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedScale(
            scale: selected ? 1.12 : 1,
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOutBack,
            child: MzIcon(
              tab.icon,
              size: 25,
              color: selected ? scheme.primary : colour,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            tr(uiLanguage, tab.word),
            style: TextStyle(
              fontSize: 10.5,
              height: 1.1,
              fontWeight: selected ? FontWeight.w800 : FontWeight.w500,
              color: colour,
            ),
          ),
        ],
      ),
    );
  }
}

/// A stationary gold-to-clay trophy medallion with laurel leaves and painted sparkle accents.
class TrophyButton extends StatelessWidget {
  const TrophyButton({
    super.key,
    required this.selected,
    required this.onTap,
    required this.label,
  });
  final bool selected;
  final VoidCallback onTap;
  final String label;
  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    selected: selected,
    label: label,
    child: SizedBox(
      width: 64,
      height: 64,
      child: FloatingActionButton(
        heroTag: 'leaderboard-trophy',
        tooltip: label,
        onPressed: onTap,
        shape: const CircleBorder(),
        elevation: selected ? 5 : 2,
        backgroundColor: Theme.of(context).colorScheme.surface,
        child: CustomPaint(
          painter: _MedallionPainter(
            sweep: 0,
            glow: selected ? 1 : 0.5,
            ring: Theme.of(context).colorScheme.surface,
            dark: Theme.of(context).brightness == Brightness.dark,
          ),
          child: const SizedBox(
            width: 64,
            height: 64,
            child: Center(
              child: Icon(
                Icons.emoji_events_rounded,
                size: 30,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

class _MedallionPainter extends CustomPainter {
  _MedallionPainter({
    required this.sweep,
    required this.glow,
    required this.ring,
    required this.dark,
  });
  final double sweep;
  final double glow;
  final Color ring;
  final bool dark;

  static const _clay = Color(0xFFC8582B);
  static const _gold = Color(0xFFE2A83B);
  static const _leaf = Color(0xFF6B8E4E);

  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    const r = 27.0;
    // laurel: a branch of leaves up each side, from the bottom round to the shoulders
    for (final side in [-1.0, 1.0]) {
      for (var i = 0; i < 7; i++) {
        final deg =
            98 + i * 21.0; // measured from the right, clockwise on screen
        final a = (side < 0 ? deg : 180 - deg) * math.pi / 180;
        final base = c + Offset(math.cos(a), math.sin(a)) * (r + 6);
        canvas.save();
        canvas.translate(base.dx, base.dy);
        canvas.rotate(a + side * (math.pi / 2 - 0.55));
        final leaf = Path()
          ..moveTo(0, 0)
          ..quadraticBezierTo(5.5, -6, 0, -13)
          ..quadraticBezierTo(-5.5, -6, 0, 0);
        canvas.drawPath(
          leaf,
          Paint()..color = Color.lerp(_leaf, _gold, i / 8)!,
        );
        canvas.restore();
      }
    }
    // glow and ring so the button sits above the bar
    canvas.drawCircle(
      c,
      r + 5,
      Paint()
        ..color = _gold.withValues(alpha: 0.18 + 0.2 * glow)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 9),
    );
    canvas.drawCircle(c, r + 3, Paint()..color = ring);
    final rect = Rect.fromCircle(center: c, radius: r);
    canvas.drawCircle(
      c,
      r,
      Paint()
        ..shader = const LinearGradient(
          colors: [_gold, _clay],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ).createShader(rect),
    );
    // Fixed sparkle accents; the trophy never moves or runs an idle animation.
    for (final offset in [const Offset(-18, -15), const Offset(17, 14)]) {
      final star = c + offset;
      canvas.drawLine(
        star - const Offset(3, 0),
        star + const Offset(3, 0),
        Paint()
          ..color = Colors.white
          ..strokeWidth = 1.6,
      );
      canvas.drawLine(
        star - const Offset(0, 3),
        star + const Offset(0, 3),
        Paint()
          ..color = Colors.white
          ..strokeWidth = 1.6,
      );
    }
    // Stationary gloss
    canvas.save();
    canvas.clipPath(Path()..addOval(rect));
    final x = rect.left - 30 + (rect.width + 60) * sweep;
    canvas.drawRect(
      Rect.fromLTWH(x, rect.top, 14, rect.height),
      Paint()
        ..shader = LinearGradient(
          colors: [
            Colors.white.withValues(alpha: 0),
            Colors.white.withValues(alpha: dark ? 0.28 : 0.4),
            Colors.white.withValues(alpha: 0),
          ],
        ).createShader(Rect.fromLTWH(x, 0, 14, 1)),
    );
    canvas.restore();
    canvas.drawCircle(
      c,
      r,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.6
        ..color = Colors.white.withValues(alpha: 0.55),
    );
  }

  @override
  bool shouldRepaint(_MedallionPainter old) =>
      old.sweep != sweep ||
      old.glow != glow ||
      old.dark != dark ||
      old.ring != ring;
}
