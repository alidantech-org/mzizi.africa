// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'content_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsContentList _$InsightsContentListFromJson(Map<String, dynamic> json) => InsightsContentList(
  categories: (json['categories'] as List<dynamic>).map((e) => InsightsContentListCategories.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  items: (json['items'] as List<dynamic>).map((e) => InsightsContentListItems.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsContentListToJson(InsightsContentList instance) => <String, dynamic>{
  'categories': instance.categories,
  'gaps': instance.gaps,
  'items': instance.items,
};
