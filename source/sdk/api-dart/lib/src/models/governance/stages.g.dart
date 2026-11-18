// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'stages.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceStages _$GovernanceStagesFromJson(Map<String, dynamic> json) => GovernanceStages(
  billId: json['billId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  motionId: json['motionId'] as String?,
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
  outcomeId: json['outcomeId'] as String?,
  sequenceNumber: (json['sequenceNumber'] as num).toInt(),
  sittingId: json['sittingId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  stageKindId: json['stageKindId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceStagesToJson(GovernanceStages instance) => <String, dynamic>{
  'billId': instance.billId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'motionId': ?instance.motionId,
  'onDate': ?instance.onDate?.toIso8601String(),
  'outcomeId': ?instance.outcomeId,
  'sequenceNumber': instance.sequenceNumber,
  'sittingId': ?instance.sittingId,
  'sourceCitationId': ?instance.sourceCitationId,
  'stageKindId': instance.stageKindId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
