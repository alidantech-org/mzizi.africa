// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_contests.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionElectionDetailContests _$ElectionElectionDetailContestsFromJson(Map<String, dynamic> json) => ElectionElectionDetailContests(
  candidates: (json['candidates'] as List<dynamic>)
      .map((e) => ElectionElectionDetailContestsCandidates.fromJson(e as Map<String, dynamic>))
      .toList(),
  code: json['code'] as String,
  contestId: json['contestId'] as String,
  featureId: json['featureId'] as String?,
  kindTerm: json['kindTerm'] as String,
  officeId: json['officeId'] as String?,
);

Map<String, dynamic> _$ElectionElectionDetailContestsToJson(ElectionElectionDetailContests instance) => <String, dynamic>{
  'candidates': instance.candidates,
  'code': instance.code,
  'contestId': instance.contestId,
  'featureId': ?instance.featureId,
  'kindTerm': instance.kindTerm,
  'officeId': ?instance.officeId,
};
