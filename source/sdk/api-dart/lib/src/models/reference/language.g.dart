// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceLanguage _$ReferenceLanguageFromJson(Map<String, dynamic> json) => ReferenceLanguage(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  directionId: json['directionId'] as String?,
  familyId: json['familyId'] as String?,
  glottocode: json['glottocode'] as String?,
  id: json['id'] as String,
  iso6391: json['iso6391'] as String?,
  iso6392: json['iso6392'] as String?,
  iso6393: json['iso6393'] as String?,
  kindId: json['kindId'] as String,
  name: json['name'] as String,
  parentId: json['parentId'] as String?,
  scriptId: json['scriptId'] as String?,
  statusId: json['statusId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceLanguageToJson(ReferenceLanguage instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'directionId': ?instance.directionId,
  'familyId': ?instance.familyId,
  'glottocode': ?instance.glottocode,
  'id': instance.id,
  'iso6391': ?instance.iso6391,
  'iso6392': ?instance.iso6392,
  'iso6393': ?instance.iso6393,
  'kindId': instance.kindId,
  'name': instance.name,
  'parentId': ?instance.parentId,
  'scriptId': ?instance.scriptId,
  'statusId': ?instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
