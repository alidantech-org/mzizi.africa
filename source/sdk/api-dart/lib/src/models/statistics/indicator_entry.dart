import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/statistics/aggregation.dart';
import 'package:mzizi_api/src/enums/statistics/frequency.dart';
import 'package:mzizi_api/src/models/statistics/indicator_entry_names.dart';

part 'indicator_entry.g.dart';

/// Indicator Entry
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorEntry {
  const StatisticsIndicatorEntry({
    required this.aggregation,
    required this.code,
    this.decimals,
    this.frequency,
    this.higherIsBetter,
    required this.indicatorId,
    required this.kindTerm,
    required this.names,
    this.roleTerm,
    required this.topicTerm,
    this.unitSymbol,
  });
  final StatisticsAggregation aggregation;
  final String code;
  final int? decimals;
  final StatisticsFrequency? frequency;
  final bool? higherIsBetter;
  final String indicatorId;
  final String kindTerm;
  final List<StatisticsIndicatorEntryNames> names;
  final String? roleTerm;
  final String topicTerm;
  final String? unitSymbol;

  factory StatisticsIndicatorEntry.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorEntryFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorEntryToJson(this);
}
