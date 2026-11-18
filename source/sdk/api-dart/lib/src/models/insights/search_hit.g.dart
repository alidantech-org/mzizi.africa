// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_hit.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsSearchHit _$InsightsSearchHitFromJson(Map<String, dynamic> json) => InsightsSearchHit(
  code: json['code'] as String?,
  featureId: json['featureId'] as String?,
  id: json['id'] as String,
  imageUrl: json['imageUrl'] as String?,
  kind: json['kind'] as String,
  kindLabel: json['kindLabel'] as String,
  path: (json['path'] as List<dynamic>).map((e) => e as String).toList(),
  subtitle: json['subtitle'] as String?,
  title: json['title'] as String,
);

Map<String, dynamic> _$InsightsSearchHitToJson(InsightsSearchHit instance) => <String, dynamic>{
  'code': ?instance.code,
  'featureId': ?instance.featureId,
  'id': instance.id,
  'imageUrl': ?instance.imageUrl,
  'kind': instance.kind,
  'kindLabel': instance.kindLabel,
  'path': instance.path,
  'subtitle': ?instance.subtitle,
  'title': instance.title,
};
