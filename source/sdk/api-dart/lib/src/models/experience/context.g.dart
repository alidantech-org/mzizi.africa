// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'context.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceContext _$ExperienceContextFromJson(Map<String, dynamic> json) => ExperienceContext(
  chain: (json['chain'] as List<dynamic>).map((e) => ExperiencePlaceRef.fromJson(e as Map<String, dynamic>)).toList(),
  countries: (json['countries'] as List<dynamic>).map((e) => ExperienceCountryChoice.fromJson(e as Map<String, dynamic>)).toList(),
  country: ExperienceContextCountry.fromJson(json['country'] as Map<String, dynamic>),
  countrySource: json['countrySource'] as String,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  languageCode: json['languageCode'] as String,
  levels: (json['levels'] as List<dynamic>).map((e) => ExperienceContextLevel.fromJson(e as Map<String, dynamic>)).toList(),
  place: json['place'] == null ? null : ExperiencePlaceRef.fromJson(json['place'] as Map<String, dynamic>),
  rest: (json['rest'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$ExperienceContextToJson(ExperienceContext instance) => <String, dynamic>{
  'chain': instance.chain,
  'countries': instance.countries,
  'country': instance.country,
  'countrySource': instance.countrySource,
  'gaps': instance.gaps,
  'languageCode': instance.languageCode,
  'levels': instance.levels,
  'place': ?instance.place,
  'rest': instance.rest,
};
