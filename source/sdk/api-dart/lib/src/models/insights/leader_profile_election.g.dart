// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_election.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileElection _$InsightsLeaderProfileElectionFromJson(Map<String, dynamic> json) => InsightsLeaderProfileElection(
  candidates: (json['candidates'] as num).toDouble(),
  heldOn: json['heldOn'] as String,
  margin: (json['margin'] as num).toDouble(),
  registered: (json['registered'] as num).toDouble(),
  runnerUp: (json['runner_up'] as num).toDouble(),
  share: (json['share'] as num).toDouble(),
  total: (json['total'] as num).toDouble(),
  votes: (json['votes'] as num).toDouble(),
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsLeaderProfileElectionToJson(InsightsLeaderProfileElection instance) => <String, dynamic>{
  'candidates': instance.candidates,
  'heldOn': instance.heldOn,
  'margin': instance.margin,
  'registered': instance.registered,
  'runner_up': instance.runnerUp,
  'share': instance.share,
  'total': instance.total,
  'votes': instance.votes,
  'year': instance.year,
};
