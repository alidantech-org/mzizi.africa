// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assignments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceAssignments _$GovernanceAssignmentsFromJson(Map<String, dynamic> json) => GovernanceAssignments(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  functionId: json['functionId'] as String,
  id: json['id'] as String,
  initiatorId: json['initiatorId'] as String?,
  institutionId: json['institutionId'] as String?,
  positionId: json['positionId'] as String?,
  provisionId: json['provisionId'] as String?,
  shareTerm: json['shareTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceAssignmentsToJson(GovernanceAssignments instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'functionId': instance.functionId,
  'id': instance.id,
  'initiatorId': ?instance.initiatorId,
  'institutionId': ?instance.institutionId,
  'positionId': ?instance.positionId,
  'provisionId': ?instance.provisionId,
  'shareTerm': instance.shareTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
