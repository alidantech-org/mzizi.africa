// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'memberships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsMemberships _$PoliticsMembershipsFromJson(Map<String, dynamic> json) => PoliticsMemberships(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  individualId: json['individualId'] as String,
  kindTerm: json['kindTerm'] as String,
  partyId: json['partyId'] as String,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$PoliticsMembershipsToJson(PoliticsMemberships instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'individualId': instance.individualId,
  'kindTerm': instance.kindTerm,
  'partyId': instance.partyId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
