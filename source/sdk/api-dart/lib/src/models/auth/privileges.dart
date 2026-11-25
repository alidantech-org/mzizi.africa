import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/auth/permissions.dart';
import 'package:mzizi_api/src/models/auth/roles.dart';

part 'privileges.g.dart';

/// What a role may do: a permission granted to a role, with who granted it and when.
@JsonSerializable(includeIfNull: false)
class AuthPrivileges {
  const AuthPrivileges({required this.grantedAt, required this.grantedBy, required this.permissionId, required this.roleId});
  final DateTime grantedAt;
  final String grantedBy;
  final String permissionId;
  final String roleId;

  factory AuthPrivileges.fromJson(Map<String, dynamic> json) => _$AuthPrivilegesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthPrivilegesToJson(this);
}
