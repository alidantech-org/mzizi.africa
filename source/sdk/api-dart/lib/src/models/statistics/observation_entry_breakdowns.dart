import 'package:json_annotation/json_annotation.dart';

part 'observation_entry_breakdowns.g.dart';

/// Observation Entry Breakdowns
@JsonSerializable(includeIfNull: false)
class StatisticsObservationEntryBreakdowns {
  const StatisticsObservationEntryBreakdowns({required this.schemeId, required this.termCode, required this.termId});
  final String schemeId;
  final String termCode;
  final String termId;

  factory StatisticsObservationEntryBreakdowns.fromJson(Map<String, dynamic> json) => _$StatisticsObservationEntryBreakdownsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsObservationEntryBreakdownsToJson(this);
}
