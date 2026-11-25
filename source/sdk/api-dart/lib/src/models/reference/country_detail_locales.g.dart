// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_detail_locales.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountryDetailLocales _$ReferenceCountryDetailLocalesFromJson(Map<String, dynamic> json) => ReferenceCountryDetailLocales(
  fromYear: (json['fromYear'] as num?)?.toInt(),
  languageCode: json['languageCode'] as String,
  languageId: json['languageId'] as String,
  languageIso: json['languageIso'] as String?,
  position: (json['position'] as num).toInt(),
  statusTerm: json['statusTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReferenceCountryDetailLocalesToJson(ReferenceCountryDetailLocales instance) => <String, dynamic>{
  'fromYear': ?instance.fromYear,
  'languageCode': instance.languageCode,
  'languageId': instance.languageId,
  'languageIso': ?instance.languageIso,
  'position': instance.position,
  'statusTerm': instance.statusTerm,
  'toYear': ?instance.toYear,
};
