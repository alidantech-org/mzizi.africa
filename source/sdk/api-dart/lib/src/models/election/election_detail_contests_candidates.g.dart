// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_contests_candidates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionElectionDetailContestsCandidates _$ElectionElectionDetailContestsCandidatesFromJson(Map<String, dynamic> json) =>
    ElectionElectionDetailContestsCandidates(
      ballotOrder: (json['ballotOrder'] as num?)?.toInt(),
      candidateId: json['candidateId'] as String,
      individualId: json['individualId'] as String,
      names: (json['names'] as List<dynamic>)
          .map((e) => ElectionElectionDetailContestsCandidatesNames.fromJson(e as Map<String, dynamic>))
          .toList(),
      partyCode: json['partyCode'] as String?,
      partyId: json['partyId'] as String?,
    );

Map<String, dynamic> _$ElectionElectionDetailContestsCandidatesToJson(ElectionElectionDetailContestsCandidates instance) => <String, dynamic>{
  'ballotOrder': ?instance.ballotOrder,
  'candidateId': instance.candidateId,
  'individualId': instance.individualId,
  'names': instance.names,
  'partyCode': ?instance.partyCode,
  'partyId': ?instance.partyId,
};
