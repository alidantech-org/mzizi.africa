// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fulfilments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsFulfilments _$PoliticsFulfilmentsFromJson(Map<String, dynamic> json) => PoliticsFulfilments(
  appropriationId: json['appropriationId'] as String?,
  billId: json['billId'] as String?,
  commitmentId: json['commitmentId'] as String,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String?,
  kindTerm: json['kindTerm'] as String,
  projectId: json['projectId'] as String?,
  recordedOn: json['recordedOn'] == null ? null : DateTime.parse(json['recordedOn'] as String),
  statusTerm: json['statusTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$PoliticsFulfilmentsToJson(PoliticsFulfilments instance) => <String, dynamic>{
  'appropriationId': ?instance.appropriationId,
  'billId': ?instance.billId,
  'commitmentId': instance.commitmentId,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'instrumentId': ?instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'projectId': ?instance.projectId,
  'recordedOn': ?instance.recordedOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
