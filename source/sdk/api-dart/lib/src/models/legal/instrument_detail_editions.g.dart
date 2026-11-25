// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_detail_editions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstrumentDetailEditions _$LegalInstrumentDetailEditionsFromJson(Map<String, dynamic> json) => LegalInstrumentDetailEditions(
  commencedOn: json['commencedOn'] == null ? null : DateTime.parse(json['commencedOn'] as String),
  consolidatedOn: json['consolidatedOn'] == null ? null : DateTime.parse(json['consolidatedOn'] as String),
  designation: json['designation'] as String,
  editionId: json['editionId'] as String,
);

Map<String, dynamic> _$LegalInstrumentDetailEditionsToJson(LegalInstrumentDetailEditions instance) => <String, dynamic>{
  'commencedOn': ?instance.commencedOn?.toIso8601String(),
  'consolidatedOn': ?instance.consolidatedOn?.toIso8601String(),
  'designation': instance.designation,
  'editionId': instance.editionId,
};
