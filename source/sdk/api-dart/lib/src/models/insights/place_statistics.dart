import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'place_statistics.g.dart';

/// Place Statistics
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatistics {
  const InsightsPlaceStatistics({
    required this.breakdowns,
    required this.chain,
    required this.comparisons,
    required this.gaps,
    required this.place,
    required this.siblings,
    required this.topics,
  });
  final Object? breakdowns;
  final List<InsightsPlaceCrumb> chain;
  final List<Object?> comparisons;
  final List<String> gaps;
  final InsightsPlaceCrumb place;
  final Object? siblings;
  final List<Object?> topics;

  factory InsightsPlaceStatistics.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsToJson(this);
}
