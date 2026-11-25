// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionElectionDetail _$ElectionElectionDetailFromJson(Map<String, dynamic> json) => ElectionElectionDetail(
  code: json['code'] as String,
  contests: (json['contests'] as List<dynamic>).map((e) => ElectionElectionDetailContests.fromJson(e as Map<String, dynamic>)).toList(),
  electionId: json['electionId'] as String,
  fromYear: (json['fromYear'] as num).toInt(),
  heldOn: json['heldOn'] == null ? null : DateTime.parse(json['heldOn'] as String),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => ElectionElectionDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$ElectionElectionDetailToJson(ElectionElectionDetail instance) => <String, dynamic>{
  'code': instance.code,
  'contests': instance.contests,
  'electionId': instance.electionId,
  'fromYear': instance.fromYear,
  'heldOn': ?instance.heldOn?.toIso8601String(),
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'statusTerm': instance.statusTerm,
};
