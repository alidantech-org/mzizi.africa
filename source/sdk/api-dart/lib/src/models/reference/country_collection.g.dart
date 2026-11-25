// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountryCollection _$ReferenceCountryCollectionFromJson(Map<String, dynamic> json) => ReferenceCountryCollection(
  countries: (json['countries'] as List<dynamic>).map((e) => ReferenceCountryEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceCountryCollectionToJson(ReferenceCountryCollection instance) => <String, dynamic>{
  'countries': instance.countries,
};
