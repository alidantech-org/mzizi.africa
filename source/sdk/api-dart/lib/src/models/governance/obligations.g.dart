// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'obligations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceObligations _$GovernanceObligationsFromJson(Map<String, dynamic> json) => GovernanceObligations(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  frequency: $enumDecode(_$GovernanceFrequencyEnumMap, json['frequency']),
  holderId: json['holderId'] as String,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  provisionId: json['provisionId'] as String?,
  recipientId: json['recipientId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceObligationsToJson(GovernanceObligations instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'frequency': _$GovernanceFrequencyEnumMap[instance.frequency]!,
  'holderId': instance.holderId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'provisionId': ?instance.provisionId,
  'recipientId': instance.recipientId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$GovernanceFrequencyEnumMap = {
  GovernanceFrequency.annual: 'annual',
  GovernanceFrequency.monthly: 'monthly',
  GovernanceFrequency.onEvent: 'on-event',
  GovernanceFrequency.perTerm: 'per-term',
  GovernanceFrequency.quarterly: 'quarterly',
};
