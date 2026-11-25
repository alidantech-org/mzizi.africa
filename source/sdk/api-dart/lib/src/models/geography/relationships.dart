import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/hierarchies.dart';
import 'package:mzizi_api/src/models/reference/levels.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'relationships.g.dart';

/// A dated link between places; a parent link in a hierarchy also records the inner place's level.
@JsonSerializable(includeIfNull: false)
class GeographyRelationships {
  const GeographyRelationships({
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    this.hierarchyId,
    required this.id,
    required this.kindTerm,
    this.levelId,
    required this.objectFeatureId,
    this.startsOn,
    required this.subjectFeatureId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String? hierarchyId;
  final String id;
  final String kindTerm;
  final String? levelId;
  final String objectFeatureId;
  final DateTime? startsOn;
  final String subjectFeatureId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GeographyRelationships.fromJson(Map<String, dynamic> json) => _$GeographyRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyRelationshipsToJson(this);
}
