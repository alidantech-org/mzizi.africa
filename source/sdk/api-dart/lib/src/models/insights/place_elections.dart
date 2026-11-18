import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'place_elections.g.dart';

/// Place Elections
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElections {
  const InsightsPlaceElections({
    required this.elections,
    required this.gaps,
    required this.place,
    required this.registrationTrend,
    required this.turnoutTrend,
  });
  final List<Object?> elections;
  final List<String> gaps;
  final InsightsPlaceCrumb place;
  final List<Object?> registrationTrend;
  final List<Object?> turnoutTrend;

  factory InsightsPlaceElections.fromJson(Map<String, dynamic> json) => _$InsightsPlaceElectionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsToJson(this);
}
