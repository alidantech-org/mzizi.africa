// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contests.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionContests _$ElectionContestsFromJson(Map<String, dynamic> json) => ElectionContests(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  electionId: json['electionId'] as String,
  featureId: json['featureId'] as String?,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  officeId: json['officeId'] as String?,
  previousHolderId: json['previousHolderId'] as String?,
  reasonTerm: json['reasonTerm'] as String?,
  seatCount: (json['seatCount'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionContestsToJson(ElectionContests instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'electionId': instance.electionId,
  'featureId': ?instance.featureId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'officeId': ?instance.officeId,
  'previousHolderId': ?instance.previousHolderId,
  'reasonTerm': ?instance.reasonTerm,
  'seatCount': ?instance.seatCount,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
