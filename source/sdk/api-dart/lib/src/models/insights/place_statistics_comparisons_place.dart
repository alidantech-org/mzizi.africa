import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_comparisons_place.g.dart';

/// Place Statistics Comparisons Place
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsComparisonsPlace {
  const InsightsPlaceStatisticsComparisonsPlace({
    required this.featureId,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
    this.path,
  });
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String? path;

  factory InsightsPlaceStatisticsComparisonsPlace.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsComparisonsPlaceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsComparisonsPlaceToJson(this);
}
