// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vote_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureVoteEntry _$LegislatureVoteEntryFromJson(Map<String, dynamic> json) => LegislatureVoteEntry(
  choice: $enumDecode(_$LegislatureVoteChoiceEnumMap, json['choice']),
  holderId: json['holderId'] as String,
  individualId: json['individualId'] as String,
  partyCode: json['partyCode'] as String?,
  partyId: json['partyId'] as String?,
);

Map<String, dynamic> _$LegislatureVoteEntryToJson(LegislatureVoteEntry instance) => <String, dynamic>{
  'choice': _$LegislatureVoteChoiceEnumMap[instance.choice]!,
  'holderId': instance.holderId,
  'individualId': instance.individualId,
  'partyCode': ?instance.partyCode,
  'partyId': ?instance.partyId,
};

const _$LegislatureVoteChoiceEnumMap = {
  LegislatureVoteChoice.absent: 'absent',
  LegislatureVoteChoice.abstain: 'abstain',
  LegislatureVoteChoice.no: 'no',
  LegislatureVoteChoice.yes: 'yes',
};
