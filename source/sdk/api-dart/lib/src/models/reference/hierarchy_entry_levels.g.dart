// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hierarchy_entry_levels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceHierarchyEntryLevels _$ReferenceHierarchyEntryLevelsFromJson(Map<String, dynamic> json) => ReferenceHierarchyEntryLevels(
  code: json['code'] as String,
  depth: (json['depth'] as num).toInt(),
  kindTerm: json['kindTerm'] as String,
  levelId: json['levelId'] as String,
  names: (json['names'] as List<dynamic>).map((e) => ReferenceHierarchyEntryLevelsNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceHierarchyEntryLevelsToJson(ReferenceHierarchyEntryLevels instance) => <String, dynamic>{
  'code': instance.code,
  'depth': instance.depth,
  'kindTerm': instance.kindTerm,
  'levelId': instance.levelId,
  'names': instance.names,
};
