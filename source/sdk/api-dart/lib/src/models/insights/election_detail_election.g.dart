// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_election.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetailElection _$InsightsElectionDetailElectionFromJson(Map<String, dynamic> json) => InsightsElectionDetailElection(
  code: json['code'] as String,
  contestKind: json['contestKind'] as String?,
  electionId: json['electionId'] as String,
  heldOn: json['heldOn'] as String,
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsElectionDetailElectionToJson(InsightsElectionDetailElection instance) => <String, dynamic>{
  'code': instance.code,
  'contestKind': ?instance.contestKind,
  'electionId': instance.electionId,
  'heldOn': instance.heldOn,
  'year': instance.year,
};
