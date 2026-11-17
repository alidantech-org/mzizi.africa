// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'evidence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceEvidence _$SourceEvidenceFromJson(Map<String, dynamic> json) => SourceEvidence(
  assembledAt: DateTime.parse(json['assembledAt'] as String),
  assembledBySnapshot: json['assembledBySnapshot'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceEvidenceToJson(SourceEvidence instance) => <String, dynamic>{
  'assembledAt': instance.assembledAt.toIso8601String(),
  'assembledBySnapshot': instance.assembledBySnapshot,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'id': instance.id,
  'kindId': instance.kindId,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
