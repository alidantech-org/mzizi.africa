// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verifications.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceVerifications _$SourceVerificationsFromJson(Map<String, dynamic> json) => SourceVerifications(
  assessedAt: DateTime.parse(json['assessedAt'] as String),
  code: json['code'] as String,
  confidence: (json['confidence'] as num?)?.toDouble(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  evidenceId: json['evidenceId'] as String,
  explanation: json['explanation'] as String,
  id: json['id'] as String,
  methodId: json['methodId'] as String,
  outcome: $enumDecode(_$SourceVerificationOutcomeEnumMap, json['outcome']),
  reviewerSnapshot: json['reviewerSnapshot'] as String,
  supersedesId: json['supersedesId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceVerificationsToJson(SourceVerifications instance) => <String, dynamic>{
  'assessedAt': instance.assessedAt.toIso8601String(),
  'code': instance.code,
  'confidence': ?instance.confidence,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'evidenceId': instance.evidenceId,
  'explanation': instance.explanation,
  'id': instance.id,
  'methodId': instance.methodId,
  'outcome': _$SourceVerificationOutcomeEnumMap[instance.outcome]!,
  'reviewerSnapshot': instance.reviewerSnapshot,
  'supersedesId': ?instance.supersedesId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceVerificationOutcomeEnumMap = {
  SourceVerificationOutcome.contradicted: 'contradicted',
  SourceVerificationOutcome.disputed: 'disputed',
  SourceVerificationOutcome.insufficient: 'insufficient',
  SourceVerificationOutcome.supported: 'supported',
};
