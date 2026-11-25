// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'checks.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityChecks _$CommunityChecksFromJson(Map<String, dynamic> json) => CommunityChecks(
  caseId: json['caseId'] as String,
  categoryTerm: json['categoryTerm'] as String?,
  checkedAt: DateTime.parse(json['checkedAt'] as String),
  checker: $enumDecode(_$CommunityCheckerEnumMap, json['checker']),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  score: (json['score'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  verdict: $enumDecode(_$CommunityVerdictEnumMap, json['verdict']),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityChecksToJson(CommunityChecks instance) => <String, dynamic>{
  'caseId': instance.caseId,
  'categoryTerm': ?instance.categoryTerm,
  'checkedAt': instance.checkedAt.toIso8601String(),
  'checker': _$CommunityCheckerEnumMap[instance.checker]!,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'score': ?instance.score,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'verdict': _$CommunityVerdictEnumMap[instance.verdict]!,
  'version': instance.version,
};

const _$CommunityCheckerEnumMap = {CommunityChecker.ai: 'ai', CommunityChecker.human: 'human', CommunityChecker.rules: 'rules'};

const _$CommunityVerdictEnumMap = {CommunityVerdict.fail: 'fail', CommunityVerdict.flag: 'flag', CommunityVerdict.pass: 'pass'};
