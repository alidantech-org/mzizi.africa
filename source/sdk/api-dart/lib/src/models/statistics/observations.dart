import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/statistics/collections.dart';
import 'package:mzizi_api/src/models/statistics/indicators.dart';

part 'observations.g.dart';

/// One published figure for an indicator, place, subject, period and breakdown cell, by collection and revision.
@JsonSerializable(includeIfNull: false)
class StatisticsObservations {
  const StatisticsObservations({
    required this.basis,
    required this.cell,
    this.collectionId,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    required this.featureId,
    this.fromYear,
    required this.id,
    required this.indicatorId,
    this.lower,
    required this.revision,
    this.startsOn,
    required this.status,
    this.subjectId,
    this.supersedesId,
    this.toYear,
    required this.updatedAt,
    this.upper,
    this.value,
    required this.version,
  });
  final SharedFigureBasis basis;
  final String cell;
  final String? collectionId;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String featureId;
  final int? fromYear;
  final String id;
  final String indicatorId;
  final double? lower;
  final int revision;
  final DateTime? startsOn;
  final SharedFigureStatus status;
  final String? subjectId;
  final String? supersedesId;
  final int? toYear;
  final DateTime updatedAt;
  final double? upper;
  final double? value;
  final int version;

  factory StatisticsObservations.fromJson(Map<String, dynamic> json) => _$StatisticsObservationsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsObservationsToJson(this);
}
