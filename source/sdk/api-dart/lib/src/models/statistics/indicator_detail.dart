import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/statistics/aggregation.dart';
import 'package:mzizi_api/src/enums/statistics/frequency.dart';
import 'package:mzizi_api/src/models/statistics/indicator_detail_dimensions.dart';
import 'package:mzizi_api/src/models/statistics/indicator_detail_names.dart';

part 'indicator_detail.g.dart';

/// Indicator Detail
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorDetail {
  const StatisticsIndicatorDetail({
    required this.aggregation,
    required this.code,
    this.decimals,
    required this.dimensions,
    this.frequency,
    this.higherIsBetter,
    required this.indicatorId,
    required this.isDerived,
    required this.kindTerm,
    required this.names,
    required this.topicTerm,
    this.unitId,
    this.unitSymbol,
  });
  final StatisticsAggregation aggregation;
  final String code;
  final int? decimals;
  final List<StatisticsIndicatorDetailDimensions> dimensions;
  final StatisticsFrequency? frequency;
  final bool? higherIsBetter;
  final String indicatorId;
  final bool isDerived;
  final String kindTerm;
  final List<StatisticsIndicatorDetailNames> names;
  final String topicTerm;
  final String? unitId;
  final String? unitSymbol;

  factory StatisticsIndicatorDetail.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorDetailFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorDetailToJson(this);
}
