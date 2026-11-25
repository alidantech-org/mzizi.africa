// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'keys.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductKeys _$ProductKeysFromJson(Map<String, dynamic> json) => ProductKeys(
  appId: json['appId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  id: json['id'] as String,
  maxLength: (json['maxLength'] as num?)?.toInt(),
  placeholders: (json['placeholders'] as List<dynamic>?)?.map((e) => e as String).toList(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ProductKeysToJson(ProductKeys instance) => <String, dynamic>{
  'appId': ?instance.appId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'id': instance.id,
  'maxLength': ?instance.maxLength,
  'placeholders': ?instance.placeholders,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
