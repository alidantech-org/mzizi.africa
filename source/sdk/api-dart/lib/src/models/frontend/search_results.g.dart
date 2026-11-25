// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_results.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendSearchResults _$FrontendSearchResultsFromJson(Map<String, dynamic> json) => FrontendSearchResults(
  hits: (json['hits'] as List<dynamic>).map((e) => FrontendSearchHit.fromJson(e as Map<String, dynamic>)).toList(),
  language: json['language'] as String,
);

Map<String, dynamic> _$FrontendSearchResultsToJson(FrontendSearchResults instance) => <String, dynamic>{
  'hits': instance.hits,
  'language': instance.language,
};
