// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contributions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsContributions _$PoliticsContributionsFromJson(Map<String, dynamic> json) => PoliticsContributions(
  amount: (json['amount'] as num?)?.toInt(),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  donorId: json['donorId'] as String,
  electionId: json['electionId'] as String?,
  givenOn: json['givenOn'] == null ? null : DateTime.parse(json['givenOn'] as String),
  id: json['id'] as String,
  isInKind: json['isInKind'] as bool,
  recipientId: json['recipientId'] as String,
  statusTerm: json['statusTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  versionId: json['versionId'] as String?,
);

Map<String, dynamic> _$PoliticsContributionsToJson(PoliticsContributions instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'donorId': instance.donorId,
  'electionId': ?instance.electionId,
  'givenOn': ?instance.givenOn?.toIso8601String(),
  'id': instance.id,
  'isInKind': instance.isInKind,
  'recipientId': instance.recipientId,
  'statusTerm': instance.statusTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'versionId': ?instance.versionId,
};
