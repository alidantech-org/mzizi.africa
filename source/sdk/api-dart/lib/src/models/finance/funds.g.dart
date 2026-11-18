// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'funds.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFunds _$FinanceFundsFromJson(Map<String, dynamic> json) => FinanceFunds(
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fundKindId: json['fundKindId'] as String,
  fundingSourceId: json['fundingSourceId'] as String?,
  id: json['id'] as String,
  managingEntityId: json['managingEntityId'] as String?,
  scopeUnitFeatureId: json['scopeUnitFeatureId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceFundsToJson(FinanceFunds instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fundKindId': instance.fundKindId,
  'fundingSourceId': ?instance.fundingSourceId,
  'id': instance.id,
  'managingEntityId': ?instance.managingEntityId,
  'scopeUnitFeatureId': ?instance.scopeUnitFeatureId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
