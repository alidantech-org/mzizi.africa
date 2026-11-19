// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'procurements.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicProcurements _$CivicProcurementsFromJson(Map<String, dynamic> json) => CivicProcurements(
  awardedOn: json['awardedOn'] == null ? null : DateTime.parse(json['awardedOn'] as String),
  bidderCount: (json['bidderCount'] as num?)?.toInt(),
  buyerEntityId: json['buyerEntityId'] as String,
  categoryId: json['categoryId'] as String?,
  closesOn: json['closesOn'] == null ? null : DateTime.parse(json['closesOn'] as String),
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  estimatedAmountMinorUnits: (json['estimatedAmountMinorUnits'] as num?)?.toInt(),
  evaluationBasisId: json['evaluationBasisId'] as String?,
  id: json['id'] as String,
  natureId: json['natureId'] as String?,
  procedureKindId: json['procedureKindId'] as String,
  projectId: json['projectId'] as String?,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  reference: json['reference'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  statusId: json['statusId'] as String?,
  title: json['title'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicProcurementsToJson(CivicProcurements instance) => <String, dynamic>{
  'awardedOn': ?instance.awardedOn?.toIso8601String(),
  'bidderCount': ?instance.bidderCount,
  'buyerEntityId': instance.buyerEntityId,
  'categoryId': ?instance.categoryId,
  'closesOn': ?instance.closesOn?.toIso8601String(),
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'estimatedAmountMinorUnits': ?instance.estimatedAmountMinorUnits,
  'evaluationBasisId': ?instance.evaluationBasisId,
  'id': instance.id,
  'natureId': ?instance.natureId,
  'procedureKindId': instance.procedureKindId,
  'projectId': ?instance.projectId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'reference': ?instance.reference,
  'sourceCitationId': ?instance.sourceCitationId,
  'statusId': ?instance.statusId,
  'title': ?instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
