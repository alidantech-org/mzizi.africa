// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'holders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceHolders _$GovernanceHoldersFromJson(Map<String, dynamic> json) => GovernanceHolders(
  code: json['code'] as String,
  contestId: json['contestId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  individualId: json['individualId'] as String,
  methodTerm: json['methodTerm'] as String,
  officeId: json['officeId'] as String,
  reasonTerm: json['reasonTerm'] as String?,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceHoldersToJson(GovernanceHolders instance) => <String, dynamic>{
  'code': instance.code,
  'contestId': ?instance.contestId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'individualId': instance.individualId,
  'methodTerm': instance.methodTerm,
  'officeId': instance.officeId,
  'reasonTerm': ?instance.reasonTerm,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
