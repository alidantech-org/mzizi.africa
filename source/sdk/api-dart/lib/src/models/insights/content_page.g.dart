// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'content_page.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsContentPage _$InsightsContentPageFromJson(Map<String, dynamic> json) => InsightsContentPage(
  content: InsightsContentPageContent.fromJson(json['content'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  related: (json['related'] as List<dynamic>).map((e) => InsightsContentPageRelated.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsContentPageToJson(InsightsContentPage instance) => <String, dynamic>{
  'content': instance.content,
  'gaps': instance.gaps,
  'related': instance.related,
};
