import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_age.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_community.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_language.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_residence.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_sex.dart';

part 'place_statistics_breakdowns.g.dart';

/// Place Statistics Breakdowns
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsBreakdowns {
  const InsightsPlaceStatisticsBreakdowns({this.age, this.community, this.language, this.residence, this.sex});
  final List<InsightsPlaceStatisticsBreakdownsAge>? age;
  final List<InsightsPlaceStatisticsBreakdownsCommunity>? community;
  final List<InsightsPlaceStatisticsBreakdownsLanguage>? language;
  final List<InsightsPlaceStatisticsBreakdownsResidence>? residence;
  final List<InsightsPlaceStatisticsBreakdownsSex>? sex;

  factory InsightsPlaceStatisticsBreakdowns.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsBreakdownsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsBreakdownsToJson(this);
}
