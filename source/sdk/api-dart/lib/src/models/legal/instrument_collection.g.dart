// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstrumentCollection _$LegalInstrumentCollectionFromJson(Map<String, dynamic> json) => LegalInstrumentCollection(
  instruments: (json['instruments'] as List<dynamic>).map((e) => LegalInstrumentEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LegalInstrumentCollectionToJson(LegalInstrumentCollection instance) => <String, dynamic>{
  'instruments': instance.instruments,
};
