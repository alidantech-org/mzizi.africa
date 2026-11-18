// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'context_country.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceContextCountry _$ExperienceContextCountryFromJson(Map<String, dynamic> json) => ExperienceContextCountry(
  code: json['code'] as String,
  currencyCode: json['currencyCode'] as String?,
  defaultLanguageCode: json['defaultLanguageCode'] as String?,
  isServed: json['isServed'] as bool,
  isoCode: json['isoCode'] as String?,
  name: json['name'] as String,
  subdomain: json['subdomain'] as String?,
);

Map<String, dynamic> _$ExperienceContextCountryToJson(ExperienceContextCountry instance) => <String, dynamic>{
  'code': instance.code,
  'currencyCode': ?instance.currencyCode,
  'defaultLanguageCode': ?instance.defaultLanguageCode,
  'isServed': instance.isServed,
  'isoCode': ?instance.isoCode,
  'name': instance.name,
  'subdomain': ?instance.subdomain,
};
