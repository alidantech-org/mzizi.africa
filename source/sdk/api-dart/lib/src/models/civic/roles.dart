import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/bids.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'roles.g.dart';

/// The people and organisations involved in procurement, contracts and projects, and how.
@JsonSerializable(includeIfNull: false)
class CivicRoles {
  const CivicRoles({
    this.actedOn,
    this.bidId,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    this.holderId,
    required this.id,
    this.identityId,
    this.procurementId,
    this.projectId,
    required this.roleTerm,
    this.share,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? actedOn;
  final String? bidId;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? holderId;
  final String id;
  final String? identityId;
  final String? procurementId;
  final String? projectId;
  final String roleTerm;
  final double? share;
  final DateTime updatedAt;
  final int version;

  factory CivicRoles.fromJson(Map<String, dynamic> json) => _$CivicRolesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicRolesToJson(this);
}
