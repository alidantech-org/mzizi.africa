// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_query.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsSearchQuery _$InsightsSearchQueryFromJson(Map<String, dynamic> json) => InsightsSearchQuery(
  kinds: json['kinds'] as String?,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  query: json['query'] as String,
);

Map<String, dynamic> _$InsightsSearchQueryToJson(InsightsSearchQuery instance) => <String, dynamic>{
  'kinds': ?instance.kinds,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'query': instance.query,
};
