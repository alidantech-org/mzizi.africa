// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsPartyEntry _$PoliticsPartyEntryFromJson(Map<String, dynamic> json) => PoliticsPartyEntry(
  code: json['code'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => PoliticsPartyEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  partyId: json['partyId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$PoliticsPartyEntryToJson(PoliticsPartyEntry instance) => <String, dynamic>{
  'code': instance.code,
  'fromYear': ?instance.fromYear,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'partyId': instance.partyId,
  'toYear': ?instance.toYear,
};
