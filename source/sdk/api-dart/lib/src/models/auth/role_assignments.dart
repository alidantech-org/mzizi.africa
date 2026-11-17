import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/auth/delegations.dart';
import 'package:mzizi_api/src/models/auth/memberships.dart';
import 'package:mzizi_api/src/models/auth/roles.dart';
import 'package:mzizi_api/src/models/auth/scopes.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'role_assignments.g.dart';

/// Scoped role grant to an account, optionally through a membership or delegation, with revocation history.
@JsonSerializable(includeIfNull: false)
class AuthRoleAssignments {
  const AuthRoleAssignments({
    required this.accountId,
    required this.createdAt,
    this.delegationId,
    this.expiresAt,
    required this.grantedBy,
    required this.id,
    this.membershipId,
    this.revocationReason,
    this.revokedAt,
    this.revokedBy,
    required this.roleId,
    required this.scopeId,
    this.startsAt,
  });
  final String accountId;
  final DateTime createdAt;
  final String? delegationId;
  final DateTime? expiresAt;
  final String grantedBy;
  final String id;
  final String? membershipId;
  final String? revocationReason;
  final DateTime? revokedAt;
  final String? revokedBy;
  final String roleId;
  final String scopeId;
  final DateTime? startsAt;

  factory AuthRoleAssignments.fromJson(Map<String, dynamic> json) => _$AuthRoleAssignmentsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthRoleAssignmentsToJson(this);
}
