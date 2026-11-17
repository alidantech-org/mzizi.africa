// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'media_ref.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityMediaRef _$LocalityMediaRefFromJson(Map<String, dynamic> json) => LocalityMediaRef(
  fileVersionId: json['fileVersionId'] as String,
  kind: json['kind'] as String,
  mimeType: json['mimeType'] as String?,
  title: json['title'] as String?,
  url: json['url'] as String?,
);

Map<String, dynamic> _$LocalityMediaRefToJson(LocalityMediaRef instance) => <String, dynamic>{
  'fileVersionId': instance.fileVersionId,
  'kind': instance.kind,
  'mimeType': ?instance.mimeType,
  'title': ?instance.title,
  'url': ?instance.url,
};
