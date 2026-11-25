// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail_coalitions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsPartyDetailCoalitions _$PoliticsPartyDetailCoalitionsFromJson(Map<String, dynamic> json) => PoliticsPartyDetailCoalitions(
  coalitionId: json['coalitionId'] as String,
  code: json['code'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  kindTerm: json['kindTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$PoliticsPartyDetailCoalitionsToJson(PoliticsPartyDetailCoalitions instance) => <String, dynamic>{
  'coalitionId': instance.coalitionId,
  'code': instance.code,
  'fromYear': ?instance.fromYear,
  'kindTerm': instance.kindTerm,
  'toYear': ?instance.toYear,
};
