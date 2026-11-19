// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_units.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetailUnits _$InsightsElectionDetailUnitsFromJson(Map<String, dynamic> json) => InsightsElectionDetailUnits(
  ballotsCast: (json['ballotsCast'] as num).toDouble(),
  candidates: (json['candidates'] as List<dynamic>)
      .map((e) => InsightsElectionDetailUnitsCandidates.fromJson(e as Map<String, dynamic>))
      .toList(),
  featureId: json['featureId'] as String,
  geometry: json['geometry'],
  name: json['name'] as String,
  path: json['path'] as String,
  registered: (json['registered'] as num).toDouble(),
  rejected: (json['rejected'] as num).toDouble(),
  turnout: (json['turnout'] as num).toDouble(),
  validVotes: (json['validVotes'] as num).toDouble(),
  winner: InsightsElectionDetailUnitsWinner.fromJson(json['winner'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsElectionDetailUnitsToJson(InsightsElectionDetailUnits instance) => <String, dynamic>{
  'ballotsCast': instance.ballotsCast,
  'candidates': instance.candidates,
  'featureId': instance.featureId,
  'geometry': ?instance.geometry,
  'name': instance.name,
  'path': instance.path,
  'registered': instance.registered,
  'rejected': instance.rejected,
  'turnout': instance.turnout,
  'validVotes': instance.validVotes,
  'winner': instance.winner,
};
