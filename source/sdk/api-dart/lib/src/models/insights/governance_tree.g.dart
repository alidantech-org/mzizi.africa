// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tree.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTree _$InsightsGovernanceTreeFromJson(Map<String, dynamic> json) => InsightsGovernanceTree(
  edges: (json['edges'] as List<dynamic>).map((e) => InsightsGovernanceTreeEdges.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  legend: (json['legend'] as List<dynamic>).map((e) => InsightsGovernanceTreeLegend.fromJson(e as Map<String, dynamic>)).toList(),
  nodes: (json['nodes'] as List<dynamic>).map((e) => InsightsGovernanceTreeNodes.fromJson(e as Map<String, dynamic>)).toList(),
  place: json['place'] == null ? null : InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  rail: (json['rail'] as List<dynamic>).map((e) => InsightsGovernanceTreeRail.fromJson(e as Map<String, dynamic>)).toList(),
  tab: json['tab'] == null ? null : InsightsGovernanceTreeTab.fromJson(json['tab'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsGovernanceTreeToJson(InsightsGovernanceTree instance) => <String, dynamic>{
  'edges': instance.edges,
  'gaps': instance.gaps,
  'legend': instance.legend,
  'nodes': instance.nodes,
  'place': ?instance.place,
  'rail': instance.rail,
  'tab': ?instance.tab,
};
