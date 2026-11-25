// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'classifications.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityClassifications _$IdentityClassificationsFromJson(Map<String, dynamic> json) => IdentityClassifications(
  classTerm: json['classTerm'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  schemeId: json['schemeId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$IdentityClassificationsToJson(IdentityClassifications instance) => <String, dynamic>{
  'classTerm': instance.classTerm,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'schemeId': instance.schemeId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
