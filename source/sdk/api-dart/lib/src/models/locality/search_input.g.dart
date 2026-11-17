// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalitySearchInput _$LocalitySearchInputFromJson(Map<String, dynamic> json) =>
    LocalitySearchInput(languageCode: json['languageCode'] as String?, limit: (json['limit'] as num?)?.toInt(), query: json['query'] as String);

Map<String, dynamic> _$LocalitySearchInputToJson(LocalitySearchInput instance) => <String, dynamic>{
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'query': instance.query,
};
