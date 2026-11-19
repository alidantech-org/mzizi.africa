// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_tree_rail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsGovernanceTreeRail _$InsightsGovernanceTreeRailFromJson(Map<String, dynamic> json) => InsightsGovernanceTreeRail(
  about: json['about'] as String,
  code: json['code'] as String,
  count: (json['count'] as num).toDouble(),
  label: json['label'] as String,
  refs: InsightsGovernanceTreeRailRefs.fromJson(json['refs'] as Map<String, dynamic>),
  unit: json['unit'] == null ? null : InsightsGovernanceTreeRailUnit.fromJson(json['unit'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsGovernanceTreeRailToJson(InsightsGovernanceTreeRail instance) => <String, dynamic>{
  'about': instance.about,
  'code': instance.code,
  'count': instance.count,
  'label': instance.label,
  'refs': instance.refs,
  'unit': ?instance.unit,
};
