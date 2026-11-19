// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'template.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceTemplate _$ReferenceTemplateFromJson(Map<String, dynamic> json) => ReferenceTemplate(
  armId: json['armId'] as String?,
  classId: json['classId'] as String?,
  code: json['code'] as String,
  codeTemplate: json['codeTemplate'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fanOutLevelId: json['fanOutLevelId'] as String?,
  id: json['id'] as String,
  institutionKindId: json['institutionKindId'] as String?,
  nameTemplate: json['nameTemplate'] as String,
  parentTemplateId: json['parentTemplateId'] as String?,
  patternId: json['patternId'] as String,
  produces: $enumDecode(_$ReferenceTemplateProductEnumMap, json['produces']),
  roleId: json['roleId'] as String?,
  seatBasisId: json['seatBasisId'] as String?,
  seatCount: (json['seatCount'] as num?)?.toInt(),
  selectionMethodId: json['selectionMethodId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  termLimit: (json['termLimit'] as num?)?.toInt(),
  termYears: (json['termYears'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceTemplateToJson(ReferenceTemplate instance) => <String, dynamic>{
  'armId': ?instance.armId,
  'classId': ?instance.classId,
  'code': instance.code,
  'codeTemplate': instance.codeTemplate,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fanOutLevelId': ?instance.fanOutLevelId,
  'id': instance.id,
  'institutionKindId': ?instance.institutionKindId,
  'nameTemplate': instance.nameTemplate,
  'parentTemplateId': ?instance.parentTemplateId,
  'patternId': instance.patternId,
  'produces': _$ReferenceTemplateProductEnumMap[instance.produces]!,
  'roleId': ?instance.roleId,
  'seatBasisId': ?instance.seatBasisId,
  'seatCount': ?instance.seatCount,
  'selectionMethodId': ?instance.selectionMethodId,
  'sourceCitationId': ?instance.sourceCitationId,
  'termLimit': ?instance.termLimit,
  'termYears': ?instance.termYears,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$ReferenceTemplateProductEnumMap = {
  ReferenceTemplateProduct.contact: 'contact',
  ReferenceTemplateProduct.domain: 'domain',
  ReferenceTemplateProduct.eventRule: 'event-rule',
  ReferenceTemplateProduct.institution: 'institution',
  ReferenceTemplateProduct.office: 'office',
  ReferenceTemplateProduct.position: 'position',
};
