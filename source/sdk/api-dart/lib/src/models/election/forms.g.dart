// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'forms.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionForms _$ElectionFormsFromJson(Map<String, dynamic> json) => ElectionForms(
  assetId: json['assetId'] as String,
  contestId: json['contestId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String?,
  formTerm: json['formTerm'] as String,
  id: json['id'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  stationId: json['stationId'] as String?,
  status: $enumDecode(_$ElectionFormStatusEnumMap, json['status']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionFormsToJson(ElectionForms instance) => <String, dynamic>{
  'assetId': instance.assetId,
  'contestId': instance.contestId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': ?instance.featureId,
  'formTerm': instance.formTerm,
  'id': instance.id,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'stationId': ?instance.stationId,
  'status': _$ElectionFormStatusEnumMap[instance.status]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$ElectionFormStatusEnumMap = {ElectionFormStatus.finalValue: 'final', ElectionFormStatus.provisional: 'provisional'};
