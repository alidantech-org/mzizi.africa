// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'evidence_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityEvidenceDetail _$LocalityEvidenceDetailFromJson(Map<String, dynamic> json) => LocalityEvidenceDetail(
  editionLabel: json['editionLabel'] as String?,
  evidence: LocalityEvidenceRef.fromJson(json['evidence'] as Map<String, dynamic>),
  files: (json['files'] as List<dynamic>).map((e) => LocalityMediaRef.fromJson(e as Map<String, dynamic>)).toList(),
  quotedText: json['quotedText'] as String?,
  sourceCode: json['sourceCode'] as String?,
  sourceId: json['sourceId'] as String?,
);

Map<String, dynamic> _$LocalityEvidenceDetailToJson(LocalityEvidenceDetail instance) => <String, dynamic>{
  'editionLabel': ?instance.editionLabel,
  'evidence': instance.evidence,
  'files': instance.files,
  'quotedText': ?instance.quotedText,
  'sourceCode': ?instance.sourceCode,
  'sourceId': ?instance.sourceId,
};
