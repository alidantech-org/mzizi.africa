// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'crosswalks.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyCrosswalks _$EconomyCrosswalksFromJson(Map<String, dynamic> json) => EconomyCrosswalks(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromSchemeTerm: json['fromSchemeTerm'] as String,
  fromValue: json['fromValue'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$EconomyCrosswalkKindEnumMap, json['kind']),
  toSchemeTerm: json['toSchemeTerm'] as String,
  toValue: json['toValue'] as String,
);

Map<String, dynamic> _$EconomyCrosswalksToJson(EconomyCrosswalks instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromSchemeTerm': instance.fromSchemeTerm,
  'fromValue': instance.fromValue,
  'id': instance.id,
  'kind': _$EconomyCrosswalkKindEnumMap[instance.kind]!,
  'toSchemeTerm': instance.toSchemeTerm,
  'toValue': instance.toValue,
};

const _$EconomyCrosswalkKindEnumMap = {EconomyCrosswalkKind.exact: 'exact', EconomyCrosswalkKind.partial: 'partial'};
