// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'content_page.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsContentPage _$InsightsContentPageFromJson(Map<String, dynamic> json) => InsightsContentPage(
  content: json['content'],
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  related: json['related'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsContentPageToJson(InsightsContentPage instance) => <String, dynamic>{
  'content': ?instance.content,
  'gaps': instance.gaps,
  'related': instance.related,
};
