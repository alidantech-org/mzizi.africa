// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalNames _$LegalNamesFromJson(Map<String, dynamic> json) => LegalNames(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String,
  isPreferred: json['isPreferred'] as bool,
  kindId: json['kindId'] as String,
  languageId: json['languageId'] as String,
  name: json['name'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalNamesToJson(LegalNames instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'instrumentId': instance.instrumentId,
  'isPreferred': instance.isPreferred,
  'kindId': instance.kindId,
  'languageId': instance.languageId,
  'name': instance.name,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
