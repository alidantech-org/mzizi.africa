// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commitment_entry_fulfilments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsCommitmentEntryFulfilments _$PoliticsCommitmentEntryFulfilmentsFromJson(Map<String, dynamic> json) => PoliticsCommitmentEntryFulfilments(
  appropriationId: json['appropriationId'] as String?,
  billId: json['billId'] as String?,
  contractId: json['contractId'] as String?,
  instrumentId: json['instrumentId'] as String?,
  kindTerm: json['kindTerm'] as String,
  projectId: json['projectId'] as String?,
  recordedOn: json['recordedOn'] == null ? null : DateTime.parse(json['recordedOn'] as String),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$PoliticsCommitmentEntryFulfilmentsToJson(PoliticsCommitmentEntryFulfilments instance) => <String, dynamic>{
  'appropriationId': ?instance.appropriationId,
  'billId': ?instance.billId,
  'contractId': ?instance.contractId,
  'instrumentId': ?instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'projectId': ?instance.projectId,
  'recordedOn': ?instance.recordedOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
};
