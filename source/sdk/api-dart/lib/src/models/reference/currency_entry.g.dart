// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'currency_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCurrencyEntry _$ReferenceCurrencyEntryFromJson(Map<String, dynamic> json) => ReferenceCurrencyEntry(
  code: json['code'] as String,
  currencyId: json['currencyId'] as String,
  isoCode: json['isoCode'] as String?,
  minorUnits: (json['minorUnits'] as num).toInt(),
  names: (json['names'] as List<dynamic>).map((e) => ReferenceCurrencyEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  symbol: json['symbol'] as String?,
);

Map<String, dynamic> _$ReferenceCurrencyEntryToJson(ReferenceCurrencyEntry instance) => <String, dynamic>{
  'code': instance.code,
  'currencyId': instance.currencyId,
  'isoCode': ?instance.isoCode,
  'minorUnits': instance.minorUnits,
  'names': instance.names,
  'symbol': ?instance.symbol,
};
