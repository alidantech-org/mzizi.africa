import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'services.g.dart';

/// One provider's service provision at a physical place or geographic coverage unit during a service period.
@JsonSerializable(includeIfNull: false)
class CivicServices {
  const CivicServices({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.description,
    this.endsOn,
    required this.id,
    required this.name,
    this.placeFeatureId,
    required this.providerEntityId,
    this.responsibleInstitutionId,
    this.scopeUnitFeatureId,
    required this.serviceKindId,
    this.sourceCitationId,
    this.startsOn,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String description;
  final DateTime? endsOn;
  final String id;
  final String name;
  final String? placeFeatureId;
  final String providerEntityId;
  final String? responsibleInstitutionId;
  final String? scopeUnitFeatureId;
  final String serviceKindId;
  final String? sourceCitationId;
  final DateTime? startsOn;
  final DateTime updatedAt;
  final int version;

  factory CivicServices.fromJson(Map<String, dynamic> json) => _$CivicServicesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicServicesToJson(this);
}
