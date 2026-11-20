// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerSearchInput _$ExplorerSearchInputFromJson(Map<String, dynamic> json) => ExplorerSearchInput(
  countryCode: json['countryCode'] as String,
  depth: (json['depth'] as num?)?.toInt(),
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  page: (json['page'] as num?)?.toInt(),
  parentFeatureId: json['parentFeatureId'] as String?,
  query: json['query'] as String,
);

Map<String, dynamic> _$ExplorerSearchInputToJson(ExplorerSearchInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'depth': ?instance.depth,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'page': ?instance.page,
  'parentFeatureId': ?instance.parentFeatureId,
  'query': instance.query,
};
