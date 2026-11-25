// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstrumentDetail _$LegalInstrumentDetailFromJson(Map<String, dynamic> json) => LegalInstrumentDetail(
  code: json['code'] as String,
  editions: (json['editions'] as List<dynamic>).map((e) => LegalInstrumentDetailEditions.fromJson(e as Map<String, dynamic>)).toList(),
  enactedOn: json['enactedOn'] == null ? null : DateTime.parse(json['enactedOn'] as String),
  instrumentId: json['instrumentId'] as String,
  issuerId: json['issuerId'] as String?,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => LegalInstrumentDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  statusTerm: json['statusTerm'] as String?,
);

Map<String, dynamic> _$LegalInstrumentDetailToJson(LegalInstrumentDetail instance) => <String, dynamic>{
  'code': instance.code,
  'editions': instance.editions,
  'enactedOn': ?instance.enactedOn?.toIso8601String(),
  'instrumentId': instance.instrumentId,
  'issuerId': ?instance.issuerId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'statusTerm': ?instance.statusTerm,
};
