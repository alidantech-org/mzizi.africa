// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Scheme _$SchemeFromJson(Map<String, dynamic> json) => Scheme(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  ownerSnapshot: json['ownerSnapshot'] as String,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SchemeToJson(Scheme instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'ownerSnapshot': instance.ownerSnapshot,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
