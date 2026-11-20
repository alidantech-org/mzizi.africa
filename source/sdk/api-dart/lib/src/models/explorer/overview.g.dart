// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'overview.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerOverview _$ExplorerOverviewFromJson(Map<String, dynamic> json) => ExplorerOverview(
  children: ExplorerPlaces.fromJson(json['children'] as Map<String, dynamic>),
  context: ExplorerContext.fromJson(json['context'] as Map<String, dynamic>),
  counts: (json['counts'] as List<dynamic>).map((e) => ExplorerCount.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$ExplorerOverviewToJson(ExplorerOverview instance) => <String, dynamic>{
  'children': instance.children,
  'context': instance.context,
  'counts': instance.counts,
  'gaps': instance.gaps,
};
