import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/historical_validity_entity.dart';

part 'classifications.g.dart';

/// One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time.
@JsonSerializable(includeIfNull: false)
class GeographyClassifications {
  const GeographyClassifications({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    required this.updatedAt,
    this.validFrom,
    this.validFromEarliest,
    this.validFromLatest,
    this.validUntil,
    this.validUntilEarliest,
    this.validUntilLatest,
    required this.valueId,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validFromEarliest;
  final DateTime? validFromLatest;
  final DateTime? validUntil;
  final DateTime? validUntilEarliest;
  final DateTime? validUntilLatest;
  final String valueId;
  final int version;

  factory GeographyClassifications.fromJson(Map<String, dynamic> json) => _$GeographyClassificationsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyClassificationsToJson(this);
}
