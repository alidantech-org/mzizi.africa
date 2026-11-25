import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';

part 'indicator_figure_entry.g.dart';

/// Indicator Figure Entry
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorFigureEntry {
  const StatisticsIndicatorFigureEntry({
    required this.basis,
    required this.cell,
    this.endsOn,
    required this.featureId,
    required this.figureId,
    this.fromYear,
    this.indicatorCode,
    this.indicatorId,
    this.lower,
    this.metricId,
    this.observationId,
    required this.refreshedAt,
    this.startsOn,
    required this.status,
    this.subjectId,
    this.toYear,
    this.upper,
    this.value,
  });
  final SharedFigureBasis basis;
  final String cell;
  final DateTime? endsOn;
  final String featureId;
  final String figureId;
  final int? fromYear;
  final String? indicatorCode;
  final String? indicatorId;
  final double? lower;
  final String? metricId;
  final String? observationId;
  final DateTime refreshedAt;
  final DateTime? startsOn;
  final SharedFigureStatus status;
  final String? subjectId;
  final int? toYear;
  final double? upper;
  final double? value;

  factory StatisticsIndicatorFigureEntry.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorFigureEntryFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorFigureEntryToJson(this);
}
