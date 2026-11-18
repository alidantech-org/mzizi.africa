// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_results.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsSearchResults _$InsightsSearchResultsFromJson(Map<String, dynamic> json) => InsightsSearchResults(
  counts: json['counts'],
  hits: (json['hits'] as List<dynamic>).map((e) => InsightsSearchHit.fromJson(e as Map<String, dynamic>)).toList(),
  query: json['query'] as String,
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$InsightsSearchResultsToJson(InsightsSearchResults instance) => <String, dynamic>{
  'counts': ?instance.counts,
  'hits': instance.hits,
  'query': instance.query,
  'total': instance.total,
};
