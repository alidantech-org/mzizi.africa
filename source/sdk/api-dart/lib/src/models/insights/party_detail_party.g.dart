// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail_party.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyDetailParty _$InsightsPartyDetailPartyFromJson(Map<String, dynamic> json) => InsightsPartyDetailParty(
  code: json['code'] as String,
  media: json['media'] as List<dynamic>,
  name: json['name'] as String,
  registeredOn: json['registeredOn'] as String?,
);

Map<String, dynamic> _$InsightsPartyDetailPartyToJson(InsightsPartyDetailParty instance) => <String, dynamic>{
  'code': instance.code,
  'media': instance.media,
  'name': instance.name,
  'registeredOn': ?instance.registeredOn,
};
