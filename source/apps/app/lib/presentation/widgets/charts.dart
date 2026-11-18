import 'dart:math' as math;

import 'package:fl_chart/fl_chart.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/insights/kit.dart' show compact;

/// The one palette every chart draws from, in order. Brand colours that stay readable in light and dark.
const chartPalette = <Color>[
  MziziTokens.clay,
  MziziTokens.indigo,
  MziziTokens.raffia,
  MziziTokens.calabash,
  Color(0xFF8E6BBF),
  Color(0xFF3A9EA5),
  Color(0xFFD65A87),
  MziziTokens.inkSoft,
];

Color chartColour(int i) => chartPalette[i % chartPalette.length];

TextStyle _axis(BuildContext context) => TextStyle(
  fontSize: 11,
  color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.8),
);

/// A smooth line with a soft area under it. Touch or drag to read a value; it draws itself in on first show.
class AreaLineChart extends StatelessWidget {
  const AreaLineChart({
    super.key,
    required this.values,
    required this.labels,
    this.height = 160,
    this.colour = MziziTokens.clay,
    this.format = compact,
  });
  final List<double> values;
  final List<String> labels;
  final double height;
  final Color colour;
  final String Function(num?) format;

  @override
  Widget build(BuildContext context) {
    if (values.length < 2) return SizedBox(height: height);
    final lo = values.reduce(math.min), hi = values.reduce(math.max);
    final pad = (hi - lo) == 0 ? hi.abs() * 0.1 + 1 : (hi - lo) * 0.18;
    return SizedBox(
      height: height,
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: 1),
        duration: const Duration(milliseconds: 900),
        curve: Curves.easeOutCubic,
        builder: (context, k, _) => LineChart(
          LineChartData(
            minY: lo - pad,
            maxY: hi + pad,
            gridData: const FlGridData(show: false),
            borderData: FlBorderData(show: false),
            titlesData: FlTitlesData(
              leftTitles: const AxisTitles(),
              rightTitles: const AxisTitles(),
              topTitles: const AxisTitles(),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  reservedSize: 24,
                  interval: 1,
                  getTitlesWidget: (v, meta) {
                    final i = v.round();
                    final show =
                        i == 0 ||
                        i == values.length - 1 ||
                        (values.length > 4 && i == values.length ~/ 2);
                    return show && i < labels.length
                        ? Padding(
                            padding: const EdgeInsets.only(top: 6),
                            child: Text(labels[i], style: _axis(context)),
                          )
                        : const SizedBox.shrink();
                  },
                ),
              ),
            ),
            lineTouchData: LineTouchData(
              touchTooltipData: LineTouchTooltipData(
                getTooltipItems: (spots) => [
                  for (final s in spots)
                    LineTooltipItem(
                      '${s.x.round() < labels.length ? labels[s.x.round()] : ''}\n${format(s.y)}',
                      const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 12,
                      ),
                    ),
                ],
              ),
            ),
            lineBarsData: [
              LineChartBarData(
                spots: [
                  for (var i = 0; i < values.length; i++)
                    FlSpot(i.toDouble(), lo + (values[i] - lo) * k),
                ],
                isCurved: true,
                curveSmoothness: 0.28,
                preventCurveOverShooting: true,
                color: colour,
                barWidth: 3,
                dotData: FlDotData(
                  show: values.length <= 12,
                  getDotPainter: (s, p, b, i) => FlDotCirclePainter(
                    radius: 3.5,
                    color: colour,
                    strokeWidth: 2,
                    strokeColor: Theme.of(context).colorScheme.surface,
                  ),
                ),
                belowBarData: BarAreaData(
                  show: true,
                  gradient: LinearGradient(
                    colors: [
                      colour.withValues(alpha: 0.32),
                      colour.withValues(alpha: 0),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A tiny line with no axes, for a row or a tile.
class Sparkline extends StatelessWidget {
  const Sparkline({
    super.key,
    required this.values,
    this.colour = MziziTokens.clay,
    this.height = 36,
    this.width = 96,
  });
  final List<double> values;
  final Color colour;
  final double height, width;
  @override
  Widget build(BuildContext context) => SizedBox(
    height: height,
    width: width,
    child: values.length < 2
        ? null
        : LineChart(
            LineChartData(
              gridData: const FlGridData(show: false),
              borderData: FlBorderData(show: false),
              titlesData: const FlTitlesData(show: false),
              lineTouchData: const LineTouchData(enabled: false),
              lineBarsData: [
                LineChartBarData(
                  spots: [
                    for (var i = 0; i < values.length; i++)
                      FlSpot(i.toDouble(), values[i]),
                  ],
                  isCurved: true,
                  color: colour,
                  barWidth: 2.4,
                  dotData: const FlDotData(show: false),
                  belowBarData: BarAreaData(
                    show: true,
                    color: colour.withValues(alpha: 0.14),
                  ),
                ),
              ],
            ),
          ),
  );
}

/// A ring chart with the total in the middle and a legend; touching a slice swells it.
class DonutChart extends StatefulWidget {
  const DonutChart({
    super.key,
    required this.slices,
    this.centre,
    this.size = 170,
    this.format = compact,
  });
  final List<({String label, double value})> slices;
  final String? centre;
  final double size;
  final String Function(num?) format;
  @override
  State<DonutChart> createState() => _DonutChartState();
}

class _DonutChartState extends State<DonutChart> {
  int _touched = -1;
  @override
  Widget build(BuildContext context) {
    final total = widget.slices.fold<double>(0, (a, b) => a + b.value);
    final text = Theme.of(context).textTheme;
    return Row(
      children: [
        SizedBox(
          width: widget.size,
          height: widget.size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              PieChart(
                PieChartData(
                  sectionsSpace: 2,
                  centerSpaceRadius: widget.size * 0.3,
                  pieTouchData: PieTouchData(
                    touchCallback: (e, r) => setState(
                      () => _touched =
                          r?.touchedSection?.touchedSectionIndex ?? -1,
                    ),
                  ),
                  sections: [
                    for (var i = 0; i < widget.slices.length; i++)
                      PieChartSectionData(
                        value: math.max(widget.slices[i].value, 0.0001),
                        color: chartColour(i),
                        radius: _touched == i
                            ? widget.size * 0.24
                            : widget.size * 0.2,
                        showTitle: false,
                      ),
                  ],
                ),
              ),
              if (widget.centre != null)
                Text(
                  widget.centre!,
                  style: text.titleMedium?.copyWith(fontFamily: 'Georgia'),
                ),
            ],
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (var i = 0; i < widget.slices.length; i++)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3),
                  child: Row(
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: chartColour(i),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          widget.slices[i].label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: text.bodySmall,
                        ),
                      ),
                      Text(
                        total == 0
                            ? ''
                            : '${(widget.slices[i].value / total * 100).toStringAsFixed(0)}%',
                        style: text.labelMedium,
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Vertical bars with touch tooltips (years, groups).
class VBarChart extends StatelessWidget {
  const VBarChart({
    super.key,
    required this.items,
    this.height = 170,
    this.format = compact,
  });
  final List<({String label, double value})> items;
  final double height;
  final String Function(num?) format;
  @override
  Widget build(BuildContext context) => SizedBox(
    height: height,
    child: BarChart(
      BarChartData(
        gridData: const FlGridData(show: false),
        borderData: FlBorderData(show: false),
        alignment: BarChartAlignment.spaceAround,
        titlesData: FlTitlesData(
          leftTitles: const AxisTitles(),
          rightTitles: const AxisTitles(),
          topTitles: const AxisTitles(),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 26,
              getTitlesWidget: (v, m) => v.toInt() < items.length
                  ? Padding(
                      padding: const EdgeInsets.only(top: 6),
                      child: Text(
                        items[v.toInt()].label,
                        style: _axis(context),
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ),
        ),
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            getTooltipItem: (g, gi, r, ri) => BarTooltipItem(
              '${items[gi].label}\n${format(r.toY)}',
              const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w700,
                fontSize: 12,
              ),
            ),
          ),
        ),
        barGroups: [
          for (var i = 0; i < items.length; i++)
            BarChartGroupData(
              x: i,
              barRods: [
                BarChartRodData(
                  toY: items[i].value,
                  width: 18,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(8),
                  ),
                  gradient: LinearGradient(
                    colors: [
                      chartColour(i),
                      chartColour(i).withValues(alpha: 0.6),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ],
            ),
        ],
      ),
    ),
  );
}

/// A radar (spider) chart for comparing places or leaders across a few measures, each already scaled 0 to 1.
class RadarCompare extends StatelessWidget {
  const RadarCompare({
    super.key,
    required this.axes,
    required this.series,
    this.height = 240,
  });
  final List<String> axes;
  final List<({String label, List<double> values})> series;
  final double height;
  @override
  Widget build(BuildContext context) => Column(
    children: [
      SizedBox(
        height: height,
        child: RadarChart(
          RadarChartData(
            radarShape: RadarShape.polygon,
            tickCount: 3,
            ticksTextStyle: const TextStyle(fontSize: 0),
            tickBorderData: BorderSide(color: Theme.of(context).dividerColor),
            gridBorderData: BorderSide(color: Theme.of(context).dividerColor),
            radarBorderData: const BorderSide(color: Colors.transparent),
            titlePositionPercentageOffset: 0.18,
            getTitle: (i, angle) => RadarChartTitle(text: axes[i], angle: 0),
            titleTextStyle: _axis(context),
            dataSets: [
              for (var s = 0; s < series.length; s++)
                RadarDataSet(
                  fillColor: chartColour(s).withValues(alpha: 0.22),
                  borderColor: chartColour(s),
                  borderWidth: 2.4,
                  entryRadius: 3,
                  dataEntries: [
                    for (final v in series[s].values)
                      RadarEntry(value: v.clamp(0, 1) * 100),
                  ],
                ),
            ],
          ),
        ),
      ),
      Wrap(
        spacing: 14,
        children: [
          for (var s = 0; s < series.length; s++)
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: chartColour(s),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  series[s].label,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
        ],
      ),
    ],
  );
}
