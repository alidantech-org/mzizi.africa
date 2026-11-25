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
  resourceType: $enumDecode(_$AuthResourceTypeEnumMap, json['resourceType']),
);

Map<String, dynamic> _$AuthPermissionsToJson(AuthPermissions instance) => <String, dynamic>{
  'action': _$AuthAuthActionEnumMap[instance.action]!,
  'code': instance.code,
  'description': ?instance.description,
  'fieldGroup': ?instance.fieldGroup,
  'id': instance.id,
  'isActive': instance.isActive,
  'resourceType': _$AuthResourceTypeEnumMap[instance.resourceType]!,
};

const _$AuthAuthActionEnumMap = {
  AuthAuthAction.admin: 'admin',
  AuthAuthAction.create: 'create',
  AuthAuthAction.delete: 'delete',
  AuthAuthAction.exportValue: 'export',
  AuthAuthAction.publish: 'publish',
  AuthAuthAction.read: 'read',
  AuthAuthAction.review: 'review',
  AuthAuthAction.update: 'update',
};

const _$AuthResourceTypeEnumMap = {
  AuthResourceType.auth: 'auth',
  AuthResourceType.civic: 'civic',
  AuthResourceType.community: 'community',
  AuthResourceType.economy: 'economy',
  AuthResourceType.election: 'election',
  AuthResourceType.event: 'event',
  AuthResourceType.filesystem: 'filesystem',
  AuthResourceType.finance: 'finance',
  AuthResourceType.geography: 'geography',
  AuthResourceType.governance: 'governance',
  AuthResourceType.history: 'history',
  AuthResourceType.identity: 'identity',
  AuthResourceType.legal: 'legal',
  AuthResourceType.legislature: 'legislature',
  AuthResourceType.media: 'media',
  AuthResourceType.official: 'official',
  AuthResourceType.politics: 'politics',
  AuthResourceType.product: 'product',
  AuthResourceType.reference: 'reference',
  AuthResourceType.source: 'source',
  AuthResourceType.statistics: 'statistics',
  AuthResourceType.vocabulary: 'vocabulary',
};
