import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/auth/permissions.dart';
import 'package:mzizi_api/src/models/auth/roles.dart';

part 'role_permissions.g.dart';

/// Permission granted to a role, with who granted it and when.
@JsonSerializable(includeIfNull: false)
class AuthRolePermissions {
  const AuthRolePermissions({required this.grantedAt, required this.grantedBy, required this.permissionId, required this.roleId});
  final DateTime grantedAt;
  final String grantedBy;
  final String permissionId;
  final String roleId;

  factory AuthRolePermissions.fromJson(Map<String, dynamic> json) => _$AuthRolePermissionsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthRolePermissionsToJson(this);
}
