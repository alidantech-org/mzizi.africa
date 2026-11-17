// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coded_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CodedEntity _$CodedEntityFromJson(Map<String, dynamic> json) => CodedEntity(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CodedEntityToJson(CodedEntity instance) =>
    <String, dynamic>{
      'code': instance.code,
      'createdAt': instance.createdAt.toIso8601String(),
      'deletedAt': ?instance.deletedAt?.toIso8601String(),
      'id': instance.id,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'version': instance.version,
    };
