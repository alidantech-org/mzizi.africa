import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';

part 'classifications.g.dart';

/// One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time.
@JsonSerializable(includeIfNull: false)
class GeographyClassifications {
  const GeographyClassifications({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.toYear,
    required this.updatedAt,
    required this.valueId,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final int? toYear;
  final DateTime updatedAt;
  final String valueId;
  final int version;

  factory GeographyClassifications.fromJson(Map<String, dynamic> json) => _$GeographyClassificationsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyClassificationsToJson(this);
}
