// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerLocation _$ExplorerLocationFromJson(Map<String, dynamic> json) => ExplorerLocation(
  context: ExplorerContext.fromJson(json['context'] as Map<String, dynamic>),
  found: json['found'] == null ? null : ExplorerPlaces.fromJson(json['found'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  groups: (json['groups'] as List<dynamic>).map((e) => ExplorerPlaceGroup.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ExplorerLocationToJson(ExplorerLocation instance) => <String, dynamic>{
  'context': instance.context,
  'found': ?instance.found,
  'gaps': instance.gaps,
  'groups': instance.groups,
};
