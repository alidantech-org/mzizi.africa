// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'locales.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceLocales _$ReferenceLocalesFromJson(Map<String, dynamic> json) => ReferenceLocales(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  position: (json['position'] as num).toInt(),
  statusTerm: json['statusTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceLocalesToJson(ReferenceLocales instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'languageId': instance.languageId,
  'position': instance.position,
  'statusTerm': instance.statusTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
