// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'changes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChanges _$GeographyChangesFromJson(Map<String, dynamic> json) => GeographyChanges(
  changeKindId: json['changeKindId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  effectiveOn: json['effectiveOn'] == null ? null : DateTime.parse(json['effectiveOn'] as String),
  explanation: json['explanation'] as String?,
  id: json['id'] as String,
  predecessorFeatureId: json['predecessorFeatureId'] as String?,
  successorFeatureId: json['successorFeatureId'] as String?,
  transformationId: json['transformationId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyChangesToJson(GeographyChanges instance) => <String, dynamic>{
  'changeKindId': instance.changeKindId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'effectiveOn': ?instance.effectiveOn?.toIso8601String(),
  'explanation': ?instance.explanation,
  'id': instance.id,
  'predecessorFeatureId': ?instance.predecessorFeatureId,
  'successorFeatureId': ?instance.successorFeatureId,
  'transformationId': instance.transformationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
