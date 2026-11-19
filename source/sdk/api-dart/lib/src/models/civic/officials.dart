import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'officials.g.dart';

/// A person who acted in a buying process (evaluated, approved, signed), with the role and the office held then; this is what lets a conflict be checked on a real signature.
@JsonSerializable(includeIfNull: false)
class CivicOfficials {
  const CivicOfficials({
    this.actedOn,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.individualId,
    this.officeId,
    this.procurementId,
    required this.roleId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? actedOn;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String individualId;
  final String? officeId;
  final String? procurementId;
  final String roleId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory CivicOfficials.fromJson(Map<String, dynamic> json) => _$CivicOfficialsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicOfficialsToJson(this);
}
