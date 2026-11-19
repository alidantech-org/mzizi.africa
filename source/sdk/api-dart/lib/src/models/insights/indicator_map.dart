import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/indicator_map_indicator.dart';
import 'package:mzizi_api/src/models/insights/indicator_map_units.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'indicator_map.g.dart';

/// Indicator Map
@JsonSerializable(includeIfNull: false)
class InsightsIndicatorMap {
  const InsightsIndicatorMap({required this.gaps, required this.indicator, this.parent, this.periodFrom, required this.units});
  final List<String> gaps;
  final InsightsIndicatorMapIndicator indicator;
  final InsightsPlaceCrumb? parent;
  final DateTime? periodFrom;
  final List<InsightsIndicatorMapUnits> units;

  factory InsightsIndicatorMap.fromJson(Map<String, dynamic> json) => _$InsightsIndicatorMapFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIndicatorMapToJson(this);
}
