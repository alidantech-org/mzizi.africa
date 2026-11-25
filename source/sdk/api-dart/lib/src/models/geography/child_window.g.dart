// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'child_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChildWindow _$GeographyChildWindowFromJson(Map<String, dynamic> json) => GeographyChildWindow(
  hierarchyId: json['hierarchyId'] as String?,
  levelId: json['levelId'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  parentId: json['parentId'] as String,
);

Map<String, dynamic> _$GeographyChildWindowToJson(GeographyChildWindow instance) => <String, dynamic>{
  'hierarchyId': ?instance.hierarchyId,
  'levelId': ?instance.levelId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'parentId': instance.parentId,
};
