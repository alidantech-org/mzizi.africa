// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hierarchy_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceHierarchyEntry _$ReferenceHierarchyEntryFromJson(Map<String, dynamic> json) => ReferenceHierarchyEntry(
  code: json['code'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  hierarchyId: json['hierarchyId'] as String,
  isRouting: json['isRouting'] as bool,
  kindTerm: json['kindTerm'] as String,
  levels: (json['levels'] as List<dynamic>).map((e) => ReferenceHierarchyEntryLevels.fromJson(e as Map<String, dynamic>)).toList(),
  names: (json['names'] as List<dynamic>).map((e) => ReferenceHierarchyEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReferenceHierarchyEntryToJson(ReferenceHierarchyEntry instance) => <String, dynamic>{
  'code': instance.code,
  'fromYear': ?instance.fromYear,
  'hierarchyId': instance.hierarchyId,
  'isRouting': instance.isRouting,
  'kindTerm': instance.kindTerm,
  'levels': instance.levels,
  'names': instance.names,
  'toYear': ?instance.toYear,
};
