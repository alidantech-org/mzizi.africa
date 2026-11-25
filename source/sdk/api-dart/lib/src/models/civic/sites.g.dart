// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sites.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicSites _$CivicSitesFromJson(Map<String, dynamic> json) => CivicSites(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  projectId: json['projectId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicSitesToJson(CivicSites instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'projectId': instance.projectId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
