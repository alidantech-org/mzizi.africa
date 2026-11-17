// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'permissions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthPermissions _$AuthPermissionsFromJson(Map<String, dynamic> json) => AuthPermissions(
  action: $enumDecode(_$AuthAuthActionEnumMap, json['action']),
  code: json['code'] as String,
  description: json['description'] as String?,
  fieldGroup: json['fieldGroup'] as String?,
  id: json['id'] as String,
  isActive: json['isActive'] as bool,
  resourceType: json['resourceType'] as String,
);

Map<String, dynamic> _$AuthPermissionsToJson(AuthPermissions instance) => <String, dynamic>{
  'action': _$AuthAuthActionEnumMap[instance.action]!,
  'code': instance.code,
  'description': ?instance.description,
  'fieldGroup': ?instance.fieldGroup,
  'id': instance.id,
  'isActive': instance.isActive,
  'resourceType': instance.resourceType,
};

const _$AuthAuthActionEnumMap = {
  AuthAuthAction.admin: 'admin',
  AuthAuthAction.create: 'create',
  AuthAuthAction.delete: 'delete',
  AuthAuthAction.export: 'export',
  AuthAuthAction.publish: 'publish',
  AuthAuthAction.read: 'read',
  AuthAuthAction.review: 'review',
  AuthAuthAction.update: 'update',
};
