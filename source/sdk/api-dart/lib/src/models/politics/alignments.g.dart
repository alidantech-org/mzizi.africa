// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'alignments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsAlignments _$PoliticsAlignmentsFromJson(Map<String, dynamic> json) => PoliticsAlignments(
  coalitionId: json['coalitionId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  partyId: json['partyId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$PoliticsAlignmentsToJson(PoliticsAlignments instance) => <String, dynamic>{
  'coalitionId': instance.coalitionId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'partyId': instance.partyId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
