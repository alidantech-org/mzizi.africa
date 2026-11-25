import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';
import 'package:mzizi_api/src/models/statistics/indicators.dart';
import 'package:mzizi_api/src/models/statistics/metrics.dart';
import 'package:mzizi_api/src/models/statistics/observations.dart';

part 'figures.g.dart';

/// Prepared: the one value to show per indicator or metric, place, subject, period and cell; refreshed after every load.
@JsonSerializable(includeIfNull: false)
class StatisticsFigures {
  const StatisticsFigures({
    required this.basis,
    required this.cell,
    required this.countryId,
    required this.createdAt,
    this.endsOn,
    required this.featureId,
    this.fromYear,
    required this.id,
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
  final String countryId;
  final DateTime createdAt;
  final DateTime? endsOn;
  final String featureId;
  final int? fromYear;
  final String id;
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

  factory StatisticsFigures.fromJson(Map<String, dynamic> json) => _$StatisticsFiguresFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsFiguresToJson(this);
}
