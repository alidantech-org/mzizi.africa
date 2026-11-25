// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scores.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicScores _$CivicScoresFromJson(Map<String, dynamic> json) => CivicScores(
  basis: $enumDecode(_$CivicScoreBasisEnumMap, json['basis']),
  comparables: (json['comparables'] as num).toInt(),
  computedAt: DateTime.parse(json['computedAt'] as String),
  confidence: (json['confidence'] as num?)?.toDouble(),
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  high: (json['high'] as num?)?.toDouble(),
  id: json['id'] as String,
  low: (json['low'] as num?)?.toDouble(),
  projectId: json['projectId'] as String?,
  score: (json['score'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicScoresToJson(CivicScores instance) => <String, dynamic>{
  'basis': _$CivicScoreBasisEnumMap[instance.basis]!,
  'comparables': instance.comparables,
  'computedAt': instance.computedAt.toIso8601String(),
  'confidence': ?instance.confidence,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'high': ?instance.high,
  'id': instance.id,
  'low': ?instance.low,
  'projectId': ?instance.projectId,
  'score': ?instance.score,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CivicScoreBasisEnumMap = {
  CivicScoreBasis.contracts: 'contracts',
  CivicScoreBasis.modelled: 'modelled',
  CivicScoreBasis.standardCost: 'standard-cost',
  CivicScoreBasis.survey: 'survey',
};
