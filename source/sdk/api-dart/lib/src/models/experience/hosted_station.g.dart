// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hosted_station.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceHostedStation _$ExperienceHostedStationFromJson(Map<String, dynamic> json) => ExperienceHostedStation(
  ballotsCast: (json['ballotsCast'] as num?)?.toInt(),
  electionCode: json['electionCode'] as String,
  electionYear: (json['electionYear'] as num).toInt(),
  registeredVoters: (json['registeredVoters'] as num?)?.toInt(),
  stationName: json['stationName'] as String,
  statusLabel: json['statusLabel'] as String,
  streamCount: (json['streamCount'] as num?)?.toInt(),
);

Map<String, dynamic> _$ExperienceHostedStationToJson(ExperienceHostedStation instance) => <String, dynamic>{
  'ballotsCast': ?instance.ballotsCast,
  'electionCode': instance.electionCode,
  'electionYear': instance.electionYear,
  'registeredVoters': ?instance.registeredVoters,
  'stationName': instance.stationName,
  'statusLabel': instance.statusLabel,
  'streamCount': ?instance.streamCount,
};
