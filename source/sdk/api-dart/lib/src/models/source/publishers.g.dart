// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'publishers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourcePublishers _$SourcePublishersFromJson(Map<String, dynamic> json) => SourcePublishers(
  classificationId: json['classificationId'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  name: json['name'] as String,
  officialEntityId: json['officialEntityId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourcePublishersToJson(SourcePublishers instance) => <String, dynamic>{
  'classificationId': ?instance.classificationId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kindId': instance.kindId,
  'name': instance.name,
  'officialEntityId': ?instance.officialEntityId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
