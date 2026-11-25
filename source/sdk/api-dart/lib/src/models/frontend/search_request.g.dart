// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendSearchRequest _$FrontendSearchRequestFromJson(Map<String, dynamic> json) =>
    FrontendSearchRequest(country: json['country'] as String?, lang: json['lang'] as String?, text: json['text'] as String);

Map<String, dynamic> _$FrontendSearchRequestToJson(FrontendSearchRequest instance) => <String, dynamic>{
  'country': ?instance.country,
  'lang': ?instance.lang,
  'text': instance.text,
};
