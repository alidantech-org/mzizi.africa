// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_link.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendProjectLink _$FrontendProjectLinkFromJson(Map<String, dynamic> json) => FrontendProjectLink(
  code: json['code'] as String,
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
  status: json['status'] == null ? null : SharedLocalizedText.fromJson(json['status'] as Map<String, dynamic>),
);

Map<String, dynamic> _$FrontendProjectLinkToJson(FrontendProjectLink instance) => <String, dynamic>{
  'code': instance.code,
  'name': instance.name,
  'status': ?instance.status,
};
