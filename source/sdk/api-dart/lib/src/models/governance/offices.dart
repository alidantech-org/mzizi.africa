import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'offices.g.dart';

/// One established public office, independent of any current holder and optionally scoped to a geographic unit.
@JsonSerializable(includeIfNull: false)
class GovernanceOffices {
  const GovernanceOffices({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.institutionId,
    required this.officeKindId,
    this.sourceCitationId,
    this.unitFeatureId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String institutionId;
  final String officeKindId;
  final String? sourceCitationId;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory GovernanceOffices.fromJson(Map<String, dynamic> json) => _$GovernanceOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficesToJson(this);
}
