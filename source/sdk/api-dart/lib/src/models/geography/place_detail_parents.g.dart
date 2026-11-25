// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_detail_parents.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPlaceDetailParents _$GeographyPlaceDetailParentsFromJson(Map<String, dynamic> json) => GeographyPlaceDetailParents(
  depth: (json['depth'] as num?)?.toInt(),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  hierarchyId: json['hierarchyId'] as String?,
  kindTerm: json['kindTerm'] as String,
  levelId: json['levelId'] as String?,
  parentCode: json['parentCode'] as String,
  parentId: json['parentId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyPlaceDetailParentsToJson(GeographyPlaceDetailParents instance) => <String, dynamic>{
  'depth': ?instance.depth,
  'fromYear': ?instance.fromYear,
  'hierarchyId': ?instance.hierarchyId,
  'kindTerm': instance.kindTerm,
  'levelId': ?instance.levelId,
  'parentCode': instance.parentCode,
  'parentId': instance.parentId,
  'toYear': ?instance.toYear,
};
