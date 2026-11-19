// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_list_parties.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyListParties _$InsightsPartyListPartiesFromJson(Map<String, dynamic> json) => InsightsPartyListParties(
  code: json['code'] as String,
  fundAllocationKes: (json['fundAllocationKes'] as num?)?.toDouble(),
  members: (json['members'] as num).toDouble(),
  name: json['name'] as String,
  officeHolders: (json['officeHolders'] as num).toDouble(),
  votes2022: (json['votes2022'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsPartyListPartiesToJson(InsightsPartyListParties instance) => <String, dynamic>{
  'code': instance.code,
  'fundAllocationKes': ?instance.fundAllocationKes,
  'members': instance.members,
  'name': instance.name,
  'officeHolders': instance.officeHolders,
  'votes2022': instance.votes2022,
};
