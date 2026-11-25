// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coverage.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceCoverage _$SourceCoverageFromJson(Map<String, dynamic> json) => SourceCoverage(
  checkedOn: json['checkedOn'] == null ? null : DateTime.parse(json['checkedOn'] as String),
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  expectedUrl: json['expectedUrl'] as String?,
  featureId: json['featureId'] as String?,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  levelId: json['levelId'] as String?,
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  productId: json['productId'] as String?,
  publisherId: json['publisherId'] as String?,
  sourceId: json['sourceId'] as String?,
  subjectTerm: json['subjectTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceCoverageToJson(SourceCoverage instance) => <String, dynamic>{
  'checkedOn': ?instance.checkedOn?.toIso8601String(),
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'expectedUrl': ?instance.expectedUrl,
  'featureId': ?instance.featureId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'levelId': ?instance.levelId,
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'productId': ?instance.productId,
  'publisherId': ?instance.publisherId,
  'sourceId': ?instance.sourceId,
  'subjectTerm': instance.subjectTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
