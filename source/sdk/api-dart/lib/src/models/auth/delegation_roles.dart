import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/delegations.dart';
import 'package:mzizi_api/src/models/auth/roles.dart';

part 'delegation_roles.g.dart';

/// Role included in a delegation.
@JsonSerializable(includeIfNull: false)
class AuthDelegationRoles {
  const AuthDelegationRoles({required this.delegationId, required this.roleId});
  final String delegationId;
  final String roleId;

  factory AuthDelegationRoles.fromJson(Map<String, dynamic> json) => _$AuthDelegationRolesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthDelegationRolesToJson(this);
}
