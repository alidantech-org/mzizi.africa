// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'privileges.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthPrivileges _$AuthPrivilegesFromJson(Map<String, dynamic> json) => AuthPrivileges(
  grantedAt: DateTime.parse(json['grantedAt'] as String),
  grantedBy: json['grantedBy'] as String,
  permissionId: json['permissionId'] as String,
  roleId: json['roleId'] as String,
);

Map<String, dynamic> _$AuthPrivilegesToJson(AuthPrivileges instance) => <String, dynamic>{
  'grantedAt': instance.grantedAt.toIso8601String(),
  'grantedBy': instance.grantedBy,
  'permissionId': instance.permissionId,
  'roleId': instance.roleId,
};
