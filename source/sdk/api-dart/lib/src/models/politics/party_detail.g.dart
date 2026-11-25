// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsPartyDetail _$PoliticsPartyDetailFromJson(Map<String, dynamic> json) => PoliticsPartyDetail(
  coalitions: (json['coalitions'] as List<dynamic>).map((e) => PoliticsPartyDetailCoalitions.fromJson(e as Map<String, dynamic>)).toList(),
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => PoliticsPartyDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  partyId: json['partyId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$PoliticsPartyDetailToJson(PoliticsPartyDetail instance) => <String, dynamic>{
  'coalitions': instance.coalitions,
  'code': instance.code,
  'countryId': instance.countryId,
  'fromYear': ?instance.fromYear,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'partyId': instance.partyId,
  'toYear': ?instance.toYear,
};
