import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'indicator_figures.g.dart';

/// Indicator Figures
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorFigures {
  const StatisticsIndicatorFigures({required this.countryId, this.fromYear, required this.indicatorId, this.limit, this.offset});
  final String countryId;
  final int? fromYear;
  final String indicatorId;
  final int? limit;
  final int? offset;

  factory StatisticsIndicatorFigures.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorFiguresFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorFiguresToJson(this);
}
