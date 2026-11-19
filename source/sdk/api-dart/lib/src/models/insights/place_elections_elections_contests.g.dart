// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections_elections_contests.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElectionsElectionsContests _$InsightsPlaceElectionsElectionsContestsFromJson(Map<String, dynamic> json) =>
    InsightsPlaceElectionsElectionsContests(
      ballotsCast: (json['ballotsCast'] as num).toDouble(),
      candidates: (json['candidates'] as List<dynamic>)
          .map((e) => InsightsPlaceElectionsElectionsContestsCandidates.fromJson(e as Map<String, dynamic>))
          .toList(),
      kind: json['kind'] as String,
      registered: (json['registered'] as num).toDouble(),
      turnout: (json['turnout'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceElectionsElectionsContestsToJson(InsightsPlaceElectionsElectionsContests instance) => <String, dynamic>{
  'ballotsCast': instance.ballotsCast,
  'candidates': instance.candidates,
  'kind': instance.kind,
  'registered': instance.registered,
  'turnout': instance.turnout,
};
