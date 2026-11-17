// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'source_search_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalitySourceSearchInput _$LocalitySourceSearchInputFromJson(Map<String, dynamic> json) =>
    LocalitySourceSearchInput(limit: (json['limit'] as num?)?.toInt(), query: json['query'] as String?);

Map<String, dynamic> _$LocalitySourceSearchInputToJson(LocalitySourceSearchInput instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'query': ?instance.query,
};
