// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_tree.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderTree _$InsightsLeaderTreeFromJson(Map<String, dynamic> json) => InsightsLeaderTree(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  levels: json['levels'] as List<dynamic>,
  place: json['place'] == null ? null : InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsLeaderTreeToJson(InsightsLeaderTree instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'levels': instance.levels,
  'place': ?instance.place,
};
