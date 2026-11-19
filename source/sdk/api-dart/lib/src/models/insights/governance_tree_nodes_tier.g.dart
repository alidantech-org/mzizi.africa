// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tree_nodes_tier.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTreeNodesTier _$InsightsGovernanceTreeNodesTierFromJson(Map<String, dynamic> json) => InsightsGovernanceTreeNodesTier(
  code: json['code'] as String,
  label: json['label'] as String,
  position: (json['position'] as num?)?.toDouble(),
);

Map<String, dynamic> _$InsightsGovernanceTreeNodesTierToJson(InsightsGovernanceTreeNodesTier instance) => <String, dynamic>{
  'code': instance.code,
  'label': instance.label,
  'position': ?instance.position,
};
