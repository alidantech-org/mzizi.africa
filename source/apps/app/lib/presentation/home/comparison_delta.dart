// Relative change keeps percentage points distinct from fractions and preserves zero baselines.
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/home/standing.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

String comparisonDelta(
  BuildContext context,
  double? a,
  double? b,
  String baseline,
) {
  if (a == null || b == null) return t(context, 'Not enough data to compare');
  if (b == 0) {
    return t(
      context,
      a == 0
          ? 'Both places record zero. Relative percentage change is undefined.'
          : 'The comparison place records zero. Relative percentage change is undefined.',
    );
  }
  return percentWords(context, (a - b) / b * 100, baseline);
}
