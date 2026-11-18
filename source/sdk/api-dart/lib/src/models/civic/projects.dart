import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'projects.g.dart';

/// One public development or infrastructure project with responsible institution, status, geographic scope and evidence.
@JsonSerializable(includeIfNull: false)
class CivicProjects {
  const CivicProjects({
    required this.code,
    this.completedOn,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.description,
    required this.id,
    this.implementingEntityId,
    this.location,
    required this.name,
    this.responsibleInstitutionId,
    this.scopeUnitFeatureId,
    this.sourceCitationId,
    this.sponsorEntityId,
    this.startedOn,
    required this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime? completedOn;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String description;
  final String id;
  final String? implementingEntityId;
  final Object? location;
  final String name;
  final String? responsibleInstitutionId;
  final String? scopeUnitFeatureId;
  final String? sourceCitationId;
  final String? sponsorEntityId;
  final DateTime? startedOn;
  final String statusId;
  final DateTime updatedAt;
  final int version;

  factory CivicProjects.fromJson(Map<String, dynamic> json) => _$CivicProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectsToJson(this);
}
