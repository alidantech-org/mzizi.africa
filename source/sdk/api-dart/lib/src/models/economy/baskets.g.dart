// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'baskets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyBaskets _$EconomyBasketsFromJson(Map<String, dynamic> json) => EconomyBaskets(
  code: json['code'] as String,
  collectionId: json['collectionId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EconomyBasketsToJson(EconomyBaskets instance) => <String, dynamic>{
  'code': instance.code,
  'collectionId': ?instance.collectionId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
