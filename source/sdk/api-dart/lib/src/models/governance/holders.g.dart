// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'holders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceHolders _$GovernanceHoldersFromJson(Map<String, dynamic> json) => GovernanceHolders(
  appointedByEntityId: json['appointedByEntityId'] as String?,
  appointmentKindId: json['appointmentKindId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  individualId: json['individualId'] as String,
  officeId: json['officeId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceHoldersToJson(GovernanceHolders instance) => <String, dynamic>{
  'appointedByEntityId': ?instance.appointedByEntityId,
  'appointmentKindId': instance.appointmentKindId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'individualId': instance.individualId,
  'officeId': instance.officeId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'version': instance.version,
};
