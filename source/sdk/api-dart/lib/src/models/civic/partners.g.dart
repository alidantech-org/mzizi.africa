// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'partners.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicPartners _$CivicPartnersFromJson(Map<String, dynamic> json) => CivicPartners(
  bidId: json['bidId'] as String?,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  partnerEntityId: json['partnerEntityId'] as String,
  roleId: json['roleId'] as String,
  sharePercentage: (json['sharePercentage'] as num?)?.toDouble(),
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicPartnersToJson(CivicPartners instance) => <String, dynamic>{
  'bidId': ?instance.bidId,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'partnerEntityId': instance.partnerEntityId,
  'roleId': instance.roleId,
  'sharePercentage': ?instance.sharePercentage,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
