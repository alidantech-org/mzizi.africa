import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'relationships.g.dart';

/// One dated, typed relationship between two government institutions.
@JsonSerializable(includeIfNull: false)
class GovernanceRelationships {
  const GovernanceRelationships({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.objectInstitutionId,
    required this.relationshipKindId,
    this.sourceCitationId,
    required this.subjectInstitutionId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String objectInstitutionId;
  final String relationshipKindId;
  final String? sourceCitationId;
  final String subjectInstitutionId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory GovernanceRelationships.fromJson(Map<String, dynamic> json) => _$GovernanceRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceRelationshipsToJson(this);
}
