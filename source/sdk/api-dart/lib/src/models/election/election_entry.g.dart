// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionElectionEntry _$ElectionElectionEntryFromJson(Map<String, dynamic> json) => ElectionElectionEntry(
  code: json['code'] as String,
  electionId: json['electionId'] as String,
  eventId: json['eventId'] as String?,
  fromYear: (json['fromYear'] as num).toInt(),
  heldOn: json['heldOn'] == null ? null : DateTime.parse(json['heldOn'] as String),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => ElectionElectionEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$ElectionElectionEntryToJson(ElectionElectionEntry instance) => <String, dynamic>{
  'code': instance.code,
  'electionId': instance.electionId,
  'eventId': ?instance.eventId,
  'fromYear': instance.fromYear,
  'heldOn': ?instance.heldOn?.toIso8601String(),
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'statusTerm': instance.statusTerm,
};
