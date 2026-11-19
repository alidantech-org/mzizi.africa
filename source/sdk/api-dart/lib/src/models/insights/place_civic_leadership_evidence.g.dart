// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic_leadership_evidence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivicLeadershipEvidence _$InsightsPlaceCivicLeadershipEvidenceFromJson(Map<String, dynamic> json) =>
    InsightsPlaceCivicLeadershipEvidence(
      artifactTitle: json['artifactTitle'] as String,
      citationId: json['citationId'] as String,
      confidence: (json['confidence'] as num?)?.toDouble(),
      locator: json['locator'] as String,
      publisherName: json['publisherName'] as String?,
      retrievedAt: json['retrievedAt'] as String,
      sourceName: json['sourceName'] as String,
      verification: json['verification'] as String?,
    );

Map<String, dynamic> _$InsightsPlaceCivicLeadershipEvidenceToJson(InsightsPlaceCivicLeadershipEvidence instance) => <String, dynamic>{
  'artifactTitle': instance.artifactTitle,
  'citationId': instance.citationId,
  'confidence': ?instance.confidence,
  'locator': instance.locator,
  'publisherName': ?instance.publisherName,
  'retrievedAt': instance.retrievedAt,
  'sourceName': instance.sourceName,
  'verification': ?instance.verification,
};
