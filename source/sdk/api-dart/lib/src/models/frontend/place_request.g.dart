// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendPlaceRequest _$FrontendPlaceRequestFromJson(Map<String, dynamic> json) =>
    FrontendPlaceRequest(country: json['country'] as String, lang: json['lang'] as String?, place: json['place'] as String?);

Map<String, dynamic> _$FrontendPlaceRequestToJson(FrontendPlaceRequest instance) => <String, dynamic>{
  'country': instance.country,
  'lang': ?instance.lang,
  'place': ?instance.place,
};
