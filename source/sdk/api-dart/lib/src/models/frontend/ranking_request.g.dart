// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ranking_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendRankingRequest _$FrontendRankingRequestFromJson(Map<String, dynamic> json) => FrontendRankingRequest(
  country: json['country'] as String,
  indicator: json['indicator'] as String,
  lang: json['lang'] as String?,
  year: (json['year'] as num?)?.toInt(),
);

Map<String, dynamic> _$FrontendRankingRequestToJson(FrontendRankingRequest instance) => <String, dynamic>{
  'country': instance.country,
  'indicator': instance.indicator,
  'lang': ?instance.lang,
  'year': ?instance.year,
};
