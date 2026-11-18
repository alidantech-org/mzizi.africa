// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tree.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTree _$InsightsGovernanceTreeFromJson(Map<String, dynamic> json) => InsightsGovernanceTree(
  edges: json['edges'] as List<dynamic>,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  legend: json['legend'] as List<dynamic>,
  nodes: json['nodes'] as List<dynamic>,
  place: json['place'] == null ? null : InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  rail: json['rail'] as List<dynamic>,
  tab: json['tab'],
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
