// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'content_list_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsContentListInput _$InsightsContentListInputFromJson(Map<String, dynamic> json) => InsightsContentListInput(
  category: json['category'] as String?,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  query: json['query'] as String?,
  tag: json['tag'] as String?,
);

Map<String, dynamic> _$InsightsContentListInputToJson(InsightsContentListInput instance) => <String, dynamic>{
  'category': ?instance.category,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'query': ?instance.query,
  'tag': ?instance.tag,
};
