// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'candidates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionCandidates _$ElectionCandidatesFromJson(Map<String, dynamic> json) => ElectionCandidates(
  ballotOrder: (json['ballotOrder'] as num?)?.toInt(),
  code: json['code'] as String,
  contestId: json['contestId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  individualId: json['individualId'] as String,
  kindTerm: json['kindTerm'] as String,
  partyId: json['partyId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionCandidatesToJson(ElectionCandidates instance) => <String, dynamic>{
  'ballotOrder': ?instance.ballotOrder,
  'code': instance.code,
  'contestId': instance.contestId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'individualId': instance.individualId,
  'kindTerm': instance.kindTerm,
  'partyId': ?instance.partyId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
