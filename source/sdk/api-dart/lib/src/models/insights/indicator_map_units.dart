import 'package:json_annotation/json_annotation.dart';

part 'indicator_map_units.g.dart';

/// Indicator Map Units
@JsonSerializable(includeIfNull: false)
class InsightsIndicatorMapUnits {
  const InsightsIndicatorMapUnits({
    required this.estimated,
    required this.featureId,
    this.geometry,
    required this.kind,
    required this.name,
    required this.path,
    required this.rank,
    required this.value,
  });
  final bool estimated;
  final String featureId;
  final Object? geometry;
  final String kind;
  final String name;
  final String path;
  final double rank;
  final double value;

  factory InsightsIndicatorMapUnits.fromJson(Map<String, dynamic> json) => _$InsightsIndicatorMapUnitsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIndicatorMapUnitsToJson(this);
}
