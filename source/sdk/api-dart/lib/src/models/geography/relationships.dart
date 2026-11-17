import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';

part 'relationships.g.dart';

/// A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.
@JsonSerializable(includeIfNull: false)
class GeographyRelationships {
  const GeographyRelationships({
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.objectFeatureId,
    required this.relationshipKindId,
    this.startsOn,
    required this.subjectFeatureId,
    required this.systemId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String objectFeatureId;
  final String relationshipKindId;
  final DateTime? startsOn;
  final String subjectFeatureId;
  final String systemId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GeographyRelationships.fromJson(Map<String, dynamic> json) => _$GeographyRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyRelationshipsToJson(this);
}
