import 'package:json_annotation/json_annotation.dart';

part 'compare_options_nearby.g.dart';

/// Compare Options Nearby
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsNearby {
  const InsightsCompareOptionsNearby({
    required this.distanceKm,
    required this.featureId,
    required this.kindLabel,
    required this.name,
    required this.path,
  });
  final double distanceKm;
  final String featureId;
  final String kindLabel;
  final String name;
  final String path;

  factory InsightsCompareOptionsNearby.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsNearbyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsNearbyToJson(this);
}
