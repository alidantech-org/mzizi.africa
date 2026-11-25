// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'stations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionStations _$ElectionStationsFromJson(Map<String, dynamic> json) => ElectionStations(
  closesAt: json['closesAt'] == null ? null : DateTime.parse(json['closesAt'] as String),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  electionId: json['electionId'] as String,
  featureId: json['featureId'] as String,
  hostId: json['hostId'] as String?,
  id: json['id'] as String,
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  opensAt: json['opensAt'] == null ? null : DateTime.parse(json['opensAt'] as String),
  registeredVoters: (json['registeredVoters'] as num?)?.toInt(),
  statusTerm: json['statusTerm'] as String?,
  streams: (json['streams'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionStationsToJson(ElectionStations instance) => <String, dynamic>{
  'closesAt': ?instance.closesAt?.toIso8601String(),
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'electionId': instance.electionId,
  'featureId': instance.featureId,
  'hostId': ?instance.hostId,
  'id': instance.id,
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'opensAt': ?instance.opensAt?.toIso8601String(),
  'registeredVoters': ?instance.registeredVoters,
  'statusTerm': ?instance.statusTerm,
  'streams': ?instance.streams,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
