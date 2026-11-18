// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceMotions _$GovernanceMotionsFromJson(Map<String, dynamic> json) => GovernanceMotions(
  billId: json['billId'] as String?,
  budgetVersionId: json['budgetVersionId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fiscalPeriodId: json['fiscalPeriodId'] as String?,
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String?,
  motionKindId: json['motionKindId'] as String,
  movedByHolderId: json['movedByHolderId'] as String?,
  outcomeId: json['outcomeId'] as String,
  provisionId: json['provisionId'] as String?,
  sittingId: json['sittingId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  summary: json['summary'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceMotionsToJson(GovernanceMotions instance) => <String, dynamic>{
  'billId': ?instance.billId,
  'budgetVersionId': ?instance.budgetVersionId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fiscalPeriodId': ?instance.fiscalPeriodId,
  'id': instance.id,
  'instrumentId': ?instance.instrumentId,
  'motionKindId': instance.motionKindId,
  'movedByHolderId': ?instance.movedByHolderId,
  'outcomeId': instance.outcomeId,
  'provisionId': ?instance.provisionId,
  'sittingId': instance.sittingId,
  'sourceCitationId': ?instance.sourceCitationId,
  'summary': ?instance.summary,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
