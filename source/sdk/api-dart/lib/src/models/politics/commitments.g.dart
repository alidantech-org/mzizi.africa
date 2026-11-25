// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commitments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsCommitments _$PoliticsCommitmentsFromJson(Map<String, dynamic> json) => PoliticsCommitments(
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  dueOn: json['dueOn'] == null ? null : DateTime.parse(json['dueOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kind: $enumDecode(_$PoliticsCommitmentKindEnumMap, json['kind']),
  languageId: json['languageId'] as String,
  madeOn: json['madeOn'] == null ? null : DateTime.parse(json['madeOn'] as String),
  makerId: json['makerId'] as String,
  manifestoId: json['manifestoId'] as String?,
  occurrenceId: json['occurrenceId'] as String?,
  officeId: json['officeId'] as String?,
  placeId: json['placeId'] as String?,
  quantity: (json['quantity'] as num?)?.toDouble(),
  speechId: json['speechId'] as String?,
  statement: json['statement'] as String,
  statusAsOf: json['statusAsOf'] == null ? null : DateTime.parse(json['statusAsOf'] as String),
  statusTerm: json['statusTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  topicTerm: json['topicTerm'] as String?,
  unitId: json['unitId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$PoliticsCommitmentsToJson(PoliticsCommitments instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'dueOn': ?instance.dueOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kind': _$PoliticsCommitmentKindEnumMap[instance.kind]!,
  'languageId': instance.languageId,
  'madeOn': ?instance.madeOn?.toIso8601String(),
  'makerId': instance.makerId,
  'manifestoId': ?instance.manifestoId,
  'occurrenceId': ?instance.occurrenceId,
  'officeId': ?instance.officeId,
  'placeId': ?instance.placeId,
  'quantity': ?instance.quantity,
  'speechId': ?instance.speechId,
  'statement': instance.statement,
  'statusAsOf': ?instance.statusAsOf?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'toYear': ?instance.toYear,
  'topicTerm': ?instance.topicTerm,
  'unitId': ?instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$PoliticsCommitmentKindEnumMap = {
  PoliticsCommitmentKind.campaignPromise: 'campaign-promise',
  PoliticsCommitmentKind.manifestoPledge: 'manifesto-pledge',
  PoliticsCommitmentKind.officePledge: 'office-pledge',
};
