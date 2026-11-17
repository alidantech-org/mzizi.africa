// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'value.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Value _$ValueFromJson(Map<String, dynamic> json) => Value(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  label: json['label'] as String,
  parentId: json['parentId'] as String?,
  schemeId: json['schemeId'] as String,
  supersedesId: json['supersedesId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ValueToJson(Value instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'label': instance.label,
  'parentId': ?instance.parentId,
  'schemeId': instance.schemeId,
  'supersedesId': ?instance.supersedesId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
