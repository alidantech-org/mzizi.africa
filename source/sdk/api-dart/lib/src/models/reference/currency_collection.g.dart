// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'currency_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCurrencyCollection _$ReferenceCurrencyCollectionFromJson(Map<String, dynamic> json) => ReferenceCurrencyCollection(
  currencies: (json['currencies'] as List<dynamic>).map((e) => ReferenceCurrencyEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceCurrencyCollectionToJson(ReferenceCurrencyCollection instance) => <String, dynamic>{
  'currencies': instance.currencies,
};
