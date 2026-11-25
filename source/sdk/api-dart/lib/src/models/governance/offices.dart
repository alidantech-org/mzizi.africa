import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';

part 'offices.g.dart';

/// One concrete seat (the Governor of Nairobi, the MCA for Kilimani ward).
@JsonSerializable(includeIfNull: false)
class GovernanceOffices {
  const GovernanceOffices({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.featureId,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.institutionId,
    required this.positionId,
    this.seat,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String? featureId;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String institutionId;
  final String positionId;
  final String? seat;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceOffices.fromJson(Map<String, dynamic> json) => _$GovernanceOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficesToJson(this);
}
