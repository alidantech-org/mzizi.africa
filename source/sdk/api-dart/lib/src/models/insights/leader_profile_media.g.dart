// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_media.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileMedia _$InsightsLeaderProfileMediaFromJson(Map<String, dynamic> json) => InsightsLeaderProfileMedia(
  embedUrl: json['embedUrl'] as String?,
  kind: json['kind'] as String,
  mimeType: json['mimeType'] as String?,
  platform: json['platform'] as String,
  stored: json['stored'] as bool,
  thumbnailUrl: json['thumbnailUrl'] as String?,
  title: json['title'] as String,
  url: json['url'] as String,
);

Map<String, dynamic> _$InsightsLeaderProfileMediaToJson(InsightsLeaderProfileMedia instance) => <String, dynamic>{
  'embedUrl': ?instance.embedUrl,
  'kind': instance.kind,
  'mimeType': ?instance.mimeType,
  'platform': instance.platform,
  'stored': instance.stored,
  'thumbnailUrl': ?instance.thumbnailUrl,
  'title': instance.title,
  'url': instance.url,
};
