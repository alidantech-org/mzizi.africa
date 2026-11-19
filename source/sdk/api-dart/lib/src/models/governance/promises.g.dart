// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promises.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePromises _$GovernancePromisesFromJson(Map<String, dynamic> json) => GovernancePromises(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  dueOn: json['dueOn'] == null ? null : DateTime.parse(json['dueOn'] as String),
  id: json['id'] as String,
  madeOn: DateTime.parse(json['madeOn'] as String),
  makerHolderId: json['makerHolderId'] as String?,
  makerIndividualId: json['makerIndividualId'] as String?,
  occurrenceId: json['occurrenceId'] as String?,
  officeId: json['officeId'] as String?,
  placeFeatureId: json['placeFeatureId'] as String?,
  quantity: (json['quantity'] as num?)?.toDouble(),
  sittingId: json['sittingId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  speechId: json['speechId'] as String?,
  statement: json['statement'] as String,
  statusAsOf: DateTime.parse(json['statusAsOf'] as String),
  statusId: json['statusId'] as String,
  topicId: json['topicId'] as String?,
  unitId: json['unitId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernancePromisesToJson(GovernancePromises instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'dueOn': ?instance.dueOn?.toIso8601String(),
  'id': instance.id,
  'madeOn': instance.madeOn.toIso8601String(),
  'makerHolderId': ?instance.makerHolderId,
  'makerIndividualId': ?instance.makerIndividualId,
  'occurrenceId': ?instance.occurrenceId,
  'officeId': ?instance.officeId,
  'placeFeatureId': ?instance.placeFeatureId,
  'quantity': ?instance.quantity,
  'sittingId': ?instance.sittingId,
  'sourceCitationId': ?instance.sourceCitationId,
  'speechId': ?instance.speechId,
  'statement': instance.statement,
  'statusAsOf': instance.statusAsOf.toIso8601String(),
  'statusId': instance.statusId,
  'topicId': ?instance.topicId,
  'unitId': ?instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
