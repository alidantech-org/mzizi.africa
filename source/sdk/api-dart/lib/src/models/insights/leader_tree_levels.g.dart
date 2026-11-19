// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_tree_levels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderTreeLevels _$InsightsLeaderTreeLevelsFromJson(Map<String, dynamic> json) => InsightsLeaderTreeLevels(
  groups: json['groups'],
  label: json['label'] as String,
  level: json['level'] as String,
  total: (json['total'] as num).toDouble(),
  unit: json['unit'] == null ? null : InsightsLeaderTreeLevelsUnit.fromJson(json['unit'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsLeaderTreeLevelsToJson(InsightsLeaderTreeLevels instance) => <String, dynamic>{
  'groups': ?instance.groups,
  'label': instance.label,
  'level': instance.level,
  'total': instance.total,
  'unit': ?instance.unit,
};
