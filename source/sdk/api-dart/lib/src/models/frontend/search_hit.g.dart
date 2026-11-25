// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_hit.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendSearchHit _$FrontendSearchHitFromJson(Map<String, dynamic> json) => FrontendSearchHit(
  code: json['code'] as String,
  context: json['context'] == null ? null : SharedLocalizedText.fromJson(json['context'] as Map<String, dynamic>),
  kind: json['kind'] as String,
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
);

Map<String, dynamic> _$FrontendSearchHitToJson(FrontendSearchHit instance) => <String, dynamic>{
  'code': instance.code,
  'context': ?instance.context,
  'kind': instance.kind,
  'name': instance.name,
};
