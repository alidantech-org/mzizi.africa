// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bids.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicBids _$CivicBidsFromJson(Map<String, dynamic> json) => CivicBids(
  amountMinorUnits: (json['amountMinorUnits'] as num?)?.toInt(),
  bidderEntityId: json['bidderEntityId'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  outcomeId: json['outcomeId'] as String,
  procurementId: json['procurementId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  submittedOn: json['submittedOn'] == null ? null : DateTime.parse(json['submittedOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicBidsToJson(CivicBids instance) => <String, dynamic>{
  'amountMinorUnits': ?instance.amountMinorUnits,
  'bidderEntityId': instance.bidderEntityId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'outcomeId': instance.outcomeId,
  'procurementId': instance.procurementId,
  'sourceCitationId': ?instance.sourceCitationId,
  'submittedOn': ?instance.submittedOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
