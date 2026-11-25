// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'templates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceTemplates _$GovernanceTemplatesFromJson(Map<String, dynamic> json) => GovernanceTemplates(
  armTerm: json['armTerm'] as String?,
  basisTerm: json['basisTerm'] as String?,
  classTerm: json['classTerm'] as String?,
  code: json['code'] as String,
  codeTemplate: json['codeTemplate'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fanOutLevelId: json['fanOutLevelId'] as String?,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String?,
  methodTerm: json['methodTerm'] as String?,
  nameTemplate: json['nameTemplate'] as String,
  parentTemplateId: json['parentTemplateId'] as String?,
  patternId: json['patternId'] as String,
  produces: $enumDecode(_$GovernanceTemplateProductEnumMap, json['produces']),
  roleTerm: json['roleTerm'] as String?,
  seatCount: (json['seatCount'] as num?)?.toInt(),
  termLimit: (json['termLimit'] as num?)?.toInt(),
  termYears: (json['termYears'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceTemplatesToJson(GovernanceTemplates instance) => <String, dynamic>{
  'armTerm': ?instance.armTerm,
  'basisTerm': ?instance.basisTerm,
  'classTerm': ?instance.classTerm,
  'code': instance.code,
  'codeTemplate': instance.codeTemplate,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fanOutLevelId': ?instance.fanOutLevelId,
  'id': instance.id,
  'kindTerm': ?instance.kindTerm,
  'methodTerm': ?instance.methodTerm,
  'nameTemplate': instance.nameTemplate,
  'parentTemplateId': ?instance.parentTemplateId,
  'patternId': instance.patternId,
  'produces': _$GovernanceTemplateProductEnumMap[instance.produces]!,
  'roleTerm': ?instance.roleTerm,
  'seatCount': ?instance.seatCount,
  'termLimit': ?instance.termLimit,
  'termYears': ?instance.termYears,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$GovernanceTemplateProductEnumMap = {
  GovernanceTemplateProduct.contact: 'contact',
  GovernanceTemplateProduct.domain: 'domain',
  GovernanceTemplateProduct.eventRule: 'event-rule',
  GovernanceTemplateProduct.institution: 'institution',
  GovernanceTemplateProduct.office: 'office',
  GovernanceTemplateProduct.position: 'position',
};
