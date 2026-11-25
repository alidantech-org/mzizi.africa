// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountryDetail _$ReferenceCountryDetailFromJson(Map<String, dynamic> json) => ReferenceCountryDetail(
  callingCode: json['callingCode'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  currencyId: json['currencyId'] as String?,
  designationTerm: json['designationTerm'] as String?,
  establishedOn: json['establishedOn'] == null ? null : DateTime.parse(json['establishedOn'] as String),
  isoAlpha2: json['isoAlpha2'] as String?,
  isoAlpha3: json['isoAlpha3'] as String?,
  isoNumeric: json['isoNumeric'] as String?,
  locales: (json['locales'] as List<dynamic>).map((e) => ReferenceCountryDetailLocales.fromJson(e as Map<String, dynamic>)).toList(),
  names: (json['names'] as List<dynamic>).map((e) => ReferenceCountryDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  recognitionTerm: json['recognitionTerm'] as String?,
);

Map<String, dynamic> _$ReferenceCountryDetailToJson(ReferenceCountryDetail instance) => <String, dynamic>{
  'callingCode': ?instance.callingCode,
  'code': instance.code,
  'countryId': instance.countryId,
  'currencyId': ?instance.currencyId,
  'designationTerm': ?instance.designationTerm,
  'establishedOn': ?instance.establishedOn?.toIso8601String(),
  'isoAlpha2': ?instance.isoAlpha2,
  'isoAlpha3': ?instance.isoAlpha3,
  'isoNumeric': ?instance.isoNumeric,
  'locales': instance.locales,
  'names': instance.names,
  'recognitionTerm': ?instance.recognitionTerm,
};
