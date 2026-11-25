// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstrumentEntry _$LegalInstrumentEntryFromJson(Map<String, dynamic> json) => LegalInstrumentEntry(
  code: json['code'] as String,
  enactedOn: json['enactedOn'] == null ? null : DateTime.parse(json['enactedOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  instrumentId: json['instrumentId'] as String,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => LegalInstrumentEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  statusTerm: json['statusTerm'] as String?,
);

Map<String, dynamic> _$LegalInstrumentEntryToJson(LegalInstrumentEntry instance) => <String, dynamic>{
  'code': instance.code,
  'enactedOn': ?instance.enactedOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'instrumentId': instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'statusTerm': ?instance.statusTerm,
};
