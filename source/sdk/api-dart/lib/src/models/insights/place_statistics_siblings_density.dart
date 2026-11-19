import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_siblings_density.g.dart';

/// Place Statistics Siblings Density
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsSiblingsDensity {
  const InsightsPlaceStatisticsSiblingsDensity({required this.of, required this.position});
  final double of;
  final double position;

  factory InsightsPlaceStatisticsSiblingsDensity.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsSiblingsDensityFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsSiblingsDensityToJson(this);
}
