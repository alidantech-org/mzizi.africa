// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerPlace _$ExplorerPlaceFromJson(Map<String, dynamic> json) => ExplorerPlace(
  canonicalPath: json['canonicalPath'] as String,
  citationCount: (json['citationCount'] as num).toInt(),
  code: json['code'] as String,
  countryCode: json['countryCode'] as String,
  depth: (json['depth'] as num).toInt(),
  featureId: json['featureId'] as String,
  kind: json['kind'] as String,
  kindCode: json['kindCode'] as String,
  name: json['name'] as String,
  nameLanguage: json['nameLanguage'] as String?,
  parentFeatureId: json['parentFeatureId'] as String?,
  parentName: json['parentName'] as String?,
);

Map<String, dynamic> _$ExplorerPlaceToJson(ExplorerPlace instance) => <String, dynamic>{
  'canonicalPath': instance.canonicalPath,
  'citationCount': instance.citationCount,
  'code': instance.code,
  'countryCode': instance.countryCode,
  'depth': instance.depth,
  'featureId': instance.featureId,
  'kind': instance.kind,
  'kindCode': instance.kindCode,
  'name': instance.name,
  'nameLanguage': ?instance.nameLanguage,
  'parentFeatureId': ?instance.parentFeatureId,
  'parentName': ?instance.parentName,
};
