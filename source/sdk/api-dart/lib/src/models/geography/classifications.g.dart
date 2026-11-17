// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'classifications.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyClassifications _$GeographyClassificationsFromJson(Map<String, dynamic> json) => GeographyClassifications(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validFromEarliest: json['validFromEarliest'] == null ? null : DateTime.parse(json['validFromEarliest'] as String),
  validFromLatest: json['validFromLatest'] == null ? null : DateTime.parse(json['validFromLatest'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  validUntilEarliest: json['validUntilEarliest'] == null ? null : DateTime.parse(json['validUntilEarliest'] as String),
  validUntilLatest: json['validUntilLatest'] == null ? null : DateTime.parse(json['validUntilLatest'] as String),
  valueId: json['valueId'] as String,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyClassificationsToJson(GeographyClassifications instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validFromEarliest': ?instance.validFromEarliest?.toIso8601String(),
  'validFromLatest': ?instance.validFromLatest?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'validUntilEarliest': ?instance.validUntilEarliest?.toIso8601String(),
  'validUntilLatest': ?instance.validUntilLatest?.toIso8601String(),
  'valueId': instance.valueId,
  'version': instance.version,
};
