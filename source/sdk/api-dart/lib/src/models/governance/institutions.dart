import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'institutions.g.dart';

/// One government institution specialization of an Official entity.
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutions {
  const GovernanceInstitutions({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.entityId,
    required this.id,
    required this.institutionKindId,
    this.sourceCitationId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String entityId;
  final String id;
  final String institutionKindId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory GovernanceInstitutions.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionsToJson(this);
}
