import 'package:json_annotation/json_annotation.dart';

part 'place_elections_registration_trend.g.dart';

/// Place Elections Registration Trend
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElectionsRegistrationTrend {
  const InsightsPlaceElectionsRegistrationTrend({required this.estimated, required this.period, required this.value});
  final bool estimated;
  final String period;
  final double value;

  factory InsightsPlaceElectionsRegistrationTrend.fromJson(Map<String, dynamic> json) => _$InsightsPlaceElectionsRegistrationTrendFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsRegistrationTrendToJson(this);
}
