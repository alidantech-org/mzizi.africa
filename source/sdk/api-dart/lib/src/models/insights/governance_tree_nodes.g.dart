// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tree_nodes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTreeNodes _$InsightsGovernanceTreeNodesFromJson(Map<String, dynamic> json) => InsightsGovernanceTreeNodes(
  arm: json['arm'] as String?,
  basis: json['basis'] as String?,
  body: json['body'] == null ? null : InsightsGovernanceTreeNodesBody.fromJson(json['body'] as Map<String, dynamic>),
  code: json['code'] as String?,
  holderId: json['holderId'] as String?,
  how: json['how'] == null ? null : InsightsGovernanceTreeNodesHow.fromJson(json['how'] as Map<String, dynamic>),
  id: json['id'] as String,
  kind: json['kind'] as String?,
  leaderSlug: json['leaderSlug'] as String?,
  leaders: (json['leaders'] as num?)?.toDouble(),
  level: json['level'] as String,
  name: json['name'] as String,
  party: json['party'] as String?,
  performance: json['performance'] == null ? null : InsightsGovernanceTreeNodesPerformance.fromJson(json['performance'] as Map<String, dynamic>),
  photo: json['photo'] as String?,
  purpose: json['purpose'] as String?,
  refs: InsightsGovernanceTreeNodesRefs.fromJson(json['refs'] as Map<String, dynamic>),
  since: json['since'] as String?,
  tier: json['tier'] == null ? null : InsightsGovernanceTreeNodesTier.fromJson(json['tier'] as Map<String, dynamic>),
  type: json['type'] as String,
  unit: json['unit'] == null ? null : InsightsGovernanceTreeNodesUnit.fromJson(json['unit'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsGovernanceTreeNodesToJson(InsightsGovernanceTreeNodes instance) => <String, dynamic>{
  'arm': ?instance.arm,
  'basis': ?instance.basis,
  'body': ?instance.body,
  'code': ?instance.code,
  'holderId': ?instance.holderId,
  'how': ?instance.how,
  'id': instance.id,
  'kind': ?instance.kind,
  'leaderSlug': ?instance.leaderSlug,
  'leaders': ?instance.leaders,
  'level': instance.level,
  'name': instance.name,
  'party': ?instance.party,
  'performance': ?instance.performance,
  'photo': ?instance.photo,
  'purpose': ?instance.purpose,
  'refs': instance.refs,
  'since': ?instance.since,
  'tier': ?instance.tier,
  'type': instance.type,
  'unit': ?instance.unit,
};
