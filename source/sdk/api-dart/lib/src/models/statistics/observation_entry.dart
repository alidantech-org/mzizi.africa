import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/statistics/observation_entry_breakdowns.dart';

part 'observation_entry.g.dart';

/// Observation Entry
@JsonSerializable(includeIfNull: false)
class StatisticsObservationEntry {
  const StatisticsObservationEntry({
    required this.basis,
    required this.breakdowns,
    required this.cell,
    this.collectionId,
    this.fromYear,
    this.lower,
    required this.observationId,
    required this.revision,
    required this.status,
    this.supersedesId,
    this.toYear,
    this.upper,
    this.value,
  });
  final SharedFigureBasis basis;
  final List<StatisticsObservationEntryBreakdowns> breakdowns;
  final String cell;
  final String? collectionId;
  final int? fromYear;
  final double? lower;
  final String observationId;
  final int revision;
  final SharedFigureStatus status;
  final String? supersedesId;
  final int? toYear;
  final double? upper;
  final double? value;

  factory StatisticsObservationEntry.fromJson(Map<String, dynamic> json) => _$StatisticsObservationEntryFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsObservationEntryToJson(this);
}
