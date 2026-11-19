// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tree_nodes_performance.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTreeNodesPerformance _$InsightsGovernanceTreeNodesPerformanceFromJson(Map<String, dynamic> json) =>
    InsightsGovernanceTreeNodesPerformance(
      basis: json['basis'] as String,
      of: (json['of'] as num).toDouble(),
      rank: (json['rank'] as num).toDouble(),
      samples: (json['samples'] as num).toDouble(),
      score: (json['score'] as num).toDouble(),
      text: json['text'] as String,
    );

Map<String, dynamic> _$InsightsGovernanceTreeNodesPerformanceToJson(InsightsGovernanceTreeNodesPerformance instance) => <String, dynamic>{
  'basis': instance.basis,
  'of': instance.of,
  'rank': instance.rank,
  'samples': instance.samples,
  'score': instance.score,
  'text': instance.text,
};
