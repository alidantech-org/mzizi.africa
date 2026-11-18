// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bills.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceBills _$GovernanceBillsFromJson(Map<String, dynamic> json) => GovernanceBills(
  billKindId: json['billKindId'] as String,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  instrumentId: json['instrumentId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  sponsorHolderId: json['sponsorHolderId'] as String?,
  statusId: json['statusId'] as String,
  summary: json['summary'] as String?,
  termId: json['termId'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceBillsToJson(GovernanceBills instance) => <String, dynamic>{
  'billKindId': instance.billKindId,
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'institutionId': instance.institutionId,
  'instrumentId': ?instance.instrumentId,
  'sourceCitationId': ?instance.sourceCitationId,
  'sponsorHolderId': ?instance.sponsorHolderId,
  'statusId': instance.statusId,
  'summary': ?instance.summary,
  'termId': ?instance.termId,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
