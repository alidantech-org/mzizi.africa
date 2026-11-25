// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attributions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceAttributions _$SourceAttributionsFromJson(Map<String, dynamic> json) => SourceAttributions(
  artifactId: json['artifactId'] as String,
  assessedAt: DateTime.parse(json['assessedAt'] as String),
  assessorId: json['assessorId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  credit: json['credit'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  licenceTerm: json['licenceTerm'] as String?,
  publisherId: json['publisherId'] as String,
  rights: json['rights'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceAttributionsToJson(SourceAttributions instance) => <String, dynamic>{
  'artifactId': instance.artifactId,
  'assessedAt': instance.assessedAt.toIso8601String(),
  'assessorId': ?instance.assessorId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'credit': instance.credit,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'licenceTerm': ?instance.licenceTerm,
  'publisherId': instance.publisherId,
  'rights': instance.rights,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
