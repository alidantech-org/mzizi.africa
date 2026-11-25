// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'event_link.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendEventLink _$FrontendEventLinkFromJson(Map<String, dynamic> json) => FrontendEventLink(
  code: json['code'] as String,
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
  startsOn: DateTime.parse(json['startsOn'] as String),
);

Map<String, dynamic> _$FrontendEventLinkToJson(FrontendEventLink instance) => <String, dynamic>{
  'code': instance.code,
  'name': instance.name,
  'startsOn': instance.startsOn.toIso8601String(),
};
