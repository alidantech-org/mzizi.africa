// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'role_permissions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthRolePermissions _$AuthRolePermissionsFromJson(Map<String, dynamic> json) => AuthRolePermissions(
  grantedAt: DateTime.parse(json['grantedAt'] as String),
  grantedBy: json['grantedBy'] as String,
  permissionId: json['permissionId'] as String,
  roleId: json['roleId'] as String,
);

Map<String, dynamic> _$AuthRolePermissionsToJson(AuthRolePermissions instance) => <String, dynamic>{
  'grantedAt': instance.grantedAt.toIso8601String(),
  'grantedBy': instance.grantedBy,
  'permissionId': instance.permissionId,
  'roleId': instance.roleId,
};
