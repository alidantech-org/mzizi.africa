// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'evidence_ref.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityEvidenceRef _$LocalityEvidenceRefFromJson(Map<String, dynamic> json) => LocalityEvidenceRef(
  artifactTitle: json['artifactTitle'] as String?,
  citationId: json['citationId'] as String,
  confidence: (json['confidence'] as num?)?.toDouble(),
  locator: json['locator'] as String?,
  publisherName: json['publisherName'] as String?,
  retrievedAt: json['retrievedAt'] == null ? null : DateTime.parse(json['retrievedAt'] as String),
  sourceName: json['sourceName'] as String,
  verification: json['verification'] as String?,
);

Map<String, dynamic> _$LocalityEvidenceRefToJson(LocalityEvidenceRef instance) => <String, dynamic>{
  'artifactTitle': ?instance.artifactTitle,
  'citationId': instance.citationId,
  'confidence': ?instance.confidence,
  'locator': ?instance.locator,
  'publisherName': ?instance.publisherName,
  'retrievedAt': ?instance.retrievedAt?.toIso8601String(),
  'sourceName': instance.sourceName,
  'verification': ?instance.verification,
};
