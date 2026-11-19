// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_activity_votes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileActivityVotes _$InsightsLeaderProfileActivityVotesFromJson(Map<String, dynamic> json) => InsightsLeaderProfileActivityVotes(
  absent: (json['absent'] as num).toDouble(),
  abstain: (json['abstain'] as num).toDouble(),
  attendance: (json['attendance'] as num?)?.toDouble(),
  no: (json['no'] as num).toDouble(),
  total: (json['total'] as num).toDouble(),
  yes: (json['yes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsLeaderProfileActivityVotesToJson(InsightsLeaderProfileActivityVotes instance) => <String, dynamic>{
  'absent': instance.absent,
  'abstain': instance.abstain,
  'attendance': ?instance.attendance,
  'no': instance.no,
  'total': instance.total,
  'yes': instance.yes,
};
