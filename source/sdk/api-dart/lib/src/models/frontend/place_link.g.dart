// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_link.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendPlaceLink _$FrontendPlaceLinkFromJson(Map<String, dynamic> json) => FrontendPlaceLink(
  code: json['code'] as String,
  id: json['id'] as String,
  kind: json['kind'] == null ? null : SharedLocalizedText.fromJson(json['kind'] as Map<String, dynamic>),
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
);

Map<String, dynamic> _$FrontendPlaceLinkToJson(FrontendPlaceLink instance) => <String, dynamic>{
  'code': instance.code,
  'id': instance.id,
  'kind': ?instance.kind,
  'name': instance.name,
};
