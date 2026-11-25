// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountryEntry _$ReferenceCountryEntryFromJson(Map<String, dynamic> json) => ReferenceCountryEntry(
  callingCode: json['callingCode'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  currencyCode: json['currencyCode'] as String?,
  isoAlpha2: json['isoAlpha2'] as String?,
  isoAlpha3: json['isoAlpha3'] as String?,
  names: (json['names'] as List<dynamic>).map((e) => ReferenceCountryEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceCountryEntryToJson(ReferenceCountryEntry instance) => <String, dynamic>{
  'callingCode': ?instance.callingCode,
  'code': instance.code,
  'countryId': instance.countryId,
  'currencyCode': ?instance.currencyCode,
  'isoAlpha2': ?instance.isoAlpha2,
  'isoAlpha3': ?instance.isoAlpha3,
  'names': instance.names,
};
