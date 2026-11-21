import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_input.g.dart';

/// Place Statistics Input
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsInput {
  const InsightsPlaceStatisticsInput({required this.countryCode, this.languageCode, this.path, this.scope, this.topic});
  final String countryCode;
  final String? languageCode;
  final String? path;
  final String? scope;
  final String? topic;

  factory InsightsPlaceStatisticsInput.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsInputToJson(this);
}
