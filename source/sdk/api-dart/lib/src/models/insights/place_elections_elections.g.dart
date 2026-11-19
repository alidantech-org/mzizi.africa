// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections_elections.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElectionsElections _$InsightsPlaceElectionsElectionsFromJson(Map<String, dynamic> json) => InsightsPlaceElectionsElections(
  contests: (json['contests'] as List<dynamic>).map((e) => InsightsPlaceElectionsElectionsContests.fromJson(e as Map<String, dynamic>)).toList(),
  electionId: json['electionId'] as String,
  heldOn: json['heldOn'] as String,
  kind: json['kind'] as String,
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsPlaceElectionsElectionsToJson(InsightsPlaceElectionsElections instance) => <String, dynamic>{
  'contests': instance.contests,
  'electionId': instance.electionId,
  'heldOn': instance.heldOn,
  'kind': instance.kind,
  'year': instance.year,
};
