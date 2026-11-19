// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_contests.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetailContests _$InsightsElectionDetailContestsFromJson(Map<String, dynamic> json) =>
    InsightsElectionDetailContests(contests: (json['contests'] as num).toDouble(), kind: json['kind'] as String);

Map<String, dynamic> _$InsightsElectionDetailContestsToJson(InsightsElectionDetailContests instance) => <String, dynamic>{
  'contests': instance.contests,
  'kind': instance.kind,
};
