import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/compare_options_hierarchy.dart';
import 'package:mzizi_api/src/models/insights/compare_options_metrics.dart';
import 'package:mzizi_api/src/models/insights/compare_options_nearby.dart';
import 'package:mzizi_api/src/models/insights/compare_options_place.dart';
import 'package:mzizi_api/src/models/insights/compare_options_top.dart';

part 'compare_options.g.dart';

/// Compare Options
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptions {
  const InsightsCompareOptions({
    required this.gaps,
    required this.hierarchy,
    required this.metrics,
    required this.nearby,
    required this.place,
    required this.top,
  });
  final List<String> gaps;
  final List<InsightsCompareOptionsHierarchy> hierarchy;
  final List<InsightsCompareOptionsMetrics> metrics;
  final List<InsightsCompareOptionsNearby> nearby;
  final InsightsCompareOptionsPlace place;
  final List<InsightsCompareOptionsTop> top;

  factory InsightsCompareOptions.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsToJson(this);
}
