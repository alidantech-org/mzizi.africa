// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'votes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureVotes _$LegislatureVotesFromJson(Map<String, dynamic> json) => LegislatureVotes(
  choice: $enumDecode(_$LegislatureVoteChoiceEnumMap, json['choice']),
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  holderId: json['holderId'] as String,
  id: json['id'] as String,
  motionId: json['motionId'] as String,
  partyId: json['partyId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureVotesToJson(LegislatureVotes instance) => <String, dynamic>{
  'choice': _$LegislatureVoteChoiceEnumMap[instance.choice]!,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'holderId': instance.holderId,
  'id': instance.id,
  'motionId': instance.motionId,
  'partyId': ?instance.partyId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$LegislatureVoteChoiceEnumMap = {
  LegislatureVoteChoice.absent: 'absent',
  LegislatureVoteChoice.abstain: 'abstain',
  LegislatureVoteChoice.no: 'no',
  LegislatureVoteChoice.yes: 'yes',
};
