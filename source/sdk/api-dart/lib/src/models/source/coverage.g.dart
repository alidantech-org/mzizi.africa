// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coverage.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceCoverage _$SourceCoverageFromJson(Map<String, dynamic> json) => SourceCoverage(
  checkedOn: DateTime.parse(json['checkedOn'] as String),
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  coverageSubjectId: json['coverageSubjectId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  expectedPublicationUrl: json['expectedPublicationUrl'] as String?,
  id: json['id'] as String,
  levelId: json['levelId'] as String,
  note: json['note'] as String?,
  periodFrom: json['periodFrom'] == null ? null : DateTime.parse(json['periodFrom'] as String),
  periodUntil: json['periodUntil'] == null ? null : DateTime.parse(json['periodUntil'] as String),
  productId: json['productId'] as String?,
  publisherEntityId: json['publisherEntityId'] as String?,
  scopeUnitFeatureId: json['scopeUnitFeatureId'] as String?,
  sourceId: json['sourceId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceCoverageToJson(SourceCoverage instance) => <String, dynamic>{
  'checkedOn': instance.checkedOn.toIso8601String(),
  'code': instance.code,
  'countryId': instance.countryId,
  'coverageSubjectId': instance.coverageSubjectId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'expectedPublicationUrl': ?instance.expectedPublicationUrl,
  'id': instance.id,
  'levelId': instance.levelId,
  'note': ?instance.note,
  'periodFrom': ?instance.periodFrom?.toIso8601String(),
  'periodUntil': ?instance.periodUntil?.toIso8601String(),
  'productId': ?instance.productId,
  'publisherEntityId': ?instance.publisherEntityId,
  'scopeUnitFeatureId': ?instance.scopeUnitFeatureId,
  'sourceId': ?instance.sourceId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
