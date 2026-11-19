// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_content.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetailContent _$InsightsInstitutionDetailContentFromJson(Map<String, dynamic> json) => InsightsInstitutionDetailContent(
  body: json['body'] as String,
  category: InsightsInstitutionDetailContentCategory.fromJson(json['category'] as Map<String, dynamic>),
  classification: InsightsInstitutionDetailContentClassification.fromJson(json['classification'] as Map<String, dynamic>),
  code: json['code'] as String,
  frontMatter: InsightsInstitutionDetailContentFrontMatter.fromJson(json['frontMatter'] as Map<String, dynamic>),
  image: json['image'] as String,
  isDevelopmentText: json['isDevelopmentText'] as bool,
  language: json['language'] as String,
  slug: json['slug'] as String,
  subject: InsightsInstitutionDetailContentSubject.fromJson(json['subject'] as Map<String, dynamic>),
  summary: json['summary'] as String,
  tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
  title: json['title'] as String,
  unresolvedMedia: (json['unresolvedMedia'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$InsightsInstitutionDetailContentToJson(InsightsInstitutionDetailContent instance) => <String, dynamic>{
  'body': instance.body,
  'category': instance.category,
  'classification': instance.classification,
  'code': instance.code,
  'frontMatter': instance.frontMatter,
  'image': instance.image,
  'isDevelopmentText': instance.isDevelopmentText,
  'language': instance.language,
  'slug': instance.slug,
  'subject': instance.subject,
  'summary': instance.summary,
  'tags': instance.tags,
  'title': instance.title,
  'unresolvedMedia': instance.unresolvedMedia,
};
