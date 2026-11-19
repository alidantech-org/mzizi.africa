import 'package:json_annotation/json_annotation.dart';

part 'place_elections_turnout_trend.g.dart';

/// Place Elections Turnout Trend
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElectionsTurnoutTrend {
  const InsightsPlaceElectionsTurnoutTrend({required this.registered, required this.turnout, required this.year});
  final double registered;
  final double turnout;
  final double year;

  factory InsightsPlaceElectionsTurnoutTrend.fromJson(Map<String, dynamic> json) => _$InsightsPlaceElectionsTurnoutTrendFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsTurnoutTrendToJson(this);
}
