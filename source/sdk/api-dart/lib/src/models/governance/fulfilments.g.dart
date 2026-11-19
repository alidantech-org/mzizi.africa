// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fulfilments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceFulfilments _$GovernanceFulfilmentsFromJson(Map<String, dynamic> json) => GovernanceFulfilments(
  appropriationId: json['appropriationId'] as String?,
  billId: json['billId'] as String?,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  evidenceStatusId: json['evidenceStatusId'] as String,
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String?,
  kindId: json['kindId'] as String,
  projectId: json['projectId'] as String?,
  promiseId: json['promiseId'] as String,
  recordedOn: DateTime.parse(json['recordedOn'] as String),
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceFulfilmentsToJson(GovernanceFulfilments instance) => <String, dynamic>{
  'appropriationId': ?instance.appropriationId,
  'billId': ?instance.billId,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'evidenceStatusId': instance.evidenceStatusId,
  'id': instance.id,
  'instrumentId': ?instance.instrumentId,
  'kindId': instance.kindId,
  'projectId': ?instance.projectId,
  'promiseId': instance.promiseId,
  'recordedOn': instance.recordedOn.toIso8601String(),
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
