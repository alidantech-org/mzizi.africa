// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_evidence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileEvidence _$InsightsLeaderProfileEvidenceFromJson(Map<String, dynamic> json) => InsightsLeaderProfileEvidence(
  artifactTitle: json['artifactTitle'] as String,
  citationId: json['citationId'] as String,
  confidence: (json['confidence'] as num?)?.toDouble(),
  locator: json['locator'] as String,
  publisherName: json['publisherName'] as String?,
  retrievedAt: json['retrievedAt'] as String,
  sourceName: json['sourceName'] as String,
  verification: json['verification'] as String?,
);

Map<String, dynamic> _$InsightsLeaderProfileEvidenceToJson(InsightsLeaderProfileEvidence instance) => <String, dynamic>{
  'artifactTitle': instance.artifactTitle,
  'citationId': instance.citationId,
  'confidence': ?instance.confidence,
  'locator': instance.locator,
  'publisherName': ?instance.publisherName,
  'retrievedAt': instance.retrievedAt,
  'sourceName': instance.sourceName,
  'verification': ?instance.verification,
};
