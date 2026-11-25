// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'editions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceEditions _$SourceEditionsFromJson(Map<String, dynamic> json) => SourceEditions(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  designation: json['designation'] as String,
  id: json['id'] as String,
  languageId: json['languageId'] as String?,
  productId: json['productId'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceEditionsToJson(SourceEditions instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'designation': instance.designation,
  'id': instance.id,
  'languageId': ?instance.languageId,
  'productId': instance.productId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
