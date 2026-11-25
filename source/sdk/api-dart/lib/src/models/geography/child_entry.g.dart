// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'child_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChildEntry _$GeographyChildEntryFromJson(Map<String, dynamic> json) => GeographyChildEntry(
  code: json['code'] as String,
  featureId: json['featureId'] as String,
  hierarchyId: json['hierarchyId'] as String?,
  kindTerm: json['kindTerm'] as String,
  levelId: json['levelId'] as String?,
  names: (json['names'] as List<dynamic>).map((e) => GeographyChildEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyChildEntryToJson(GeographyChildEntry instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': instance.featureId,
  'hierarchyId': ?instance.hierarchyId,
  'kindTerm': instance.kindTerm,
  'levelId': ?instance.levelId,
  'names': instance.names,
};
