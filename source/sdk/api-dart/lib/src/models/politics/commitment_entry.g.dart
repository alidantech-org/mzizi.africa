// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'commitment_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsCommitmentEntry _$PoliticsCommitmentEntryFromJson(Map<String, dynamic> json) => PoliticsCommitmentEntry(
  code: json['code'] as String,
  commitmentId: json['commitmentId'] as String,
  dueOn: json['dueOn'] == null ? null : DateTime.parse(json['dueOn'] as String),
  fulfilments: (json['fulfilments'] as List<dynamic>)
      .map((e) => PoliticsCommitmentEntryFulfilments.fromJson(e as Map<String, dynamic>))
      .toList(),
  kind: $enumDecode(_$PoliticsCommitmentKindEnumMap, json['kind']),
  languageCode: json['languageCode'] as String,
  madeOn: json['madeOn'] == null ? null : DateTime.parse(json['madeOn'] as String),
  placeId: json['placeId'] as String?,
  quantity: (json['quantity'] as num?)?.toDouble(),
  statement: json['statement'] as String,
  statusAsOf: json['statusAsOf'] == null ? null : DateTime.parse(json['statusAsOf'] as String),
  statusTerm: json['statusTerm'] as String,
  topicTerm: json['topicTerm'] as String?,
);

Map<String, dynamic> _$PoliticsCommitmentEntryToJson(PoliticsCommitmentEntry instance) => <String, dynamic>{
  'code': instance.code,
  'commitmentId': instance.commitmentId,
  'dueOn': ?instance.dueOn?.toIso8601String(),
  'fulfilments': instance.fulfilments,
  'kind': _$PoliticsCommitmentKindEnumMap[instance.kind]!,
  'languageCode': instance.languageCode,
  'madeOn': ?instance.madeOn?.toIso8601String(),
  'placeId': ?instance.placeId,
  'quantity': ?instance.quantity,
  'statement': instance.statement,
  'statusAsOf': ?instance.statusAsOf?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'topicTerm': ?instance.topicTerm,
};

const _$PoliticsCommitmentKindEnumMap = {
  PoliticsCommitmentKind.campaignPromise: 'campaign-promise',
  PoliticsCommitmentKind.manifestoPledge: 'manifesto-pledge',
  PoliticsCommitmentKind.officePledge: 'office-pledge',
};
