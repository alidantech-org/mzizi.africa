// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'powers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePowers _$GovernancePowersFromJson(Map<String, dynamic> json) => GovernancePowers(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromId: json['fromId'] as String,
  id: json['id'] as String,
  isBinding: json['isBinding'] as bool,
  kindTerm: json['kindTerm'] as String,
  procedureId: json['procedureId'] as String?,
  provisionId: json['provisionId'] as String?,
  step: (json['step'] as num?)?.toInt(),
  thresholdTerm: json['thresholdTerm'] as String?,
  toId: json['toId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernancePowersToJson(GovernancePowers instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromId': instance.fromId,
  'id': instance.id,
  'isBinding': instance.isBinding,
  'kindTerm': instance.kindTerm,
  'procedureId': ?instance.procedureId,
  'provisionId': ?instance.provisionId,
  'step': ?instance.step,
  'thresholdTerm': ?instance.thresholdTerm,
  'toId': instance.toId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
