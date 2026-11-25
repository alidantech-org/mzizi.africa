// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'stages.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureStages _$LegislatureStagesFromJson(Map<String, dynamic> json) => LegislatureStages(
  billId: json['billId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  motionId: json['motionId'] as String?,
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
  outcomeTerm: json['outcomeTerm'] as String?,
  sequence: (json['sequence'] as num).toInt(),
  sittingId: json['sittingId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureStagesToJson(LegislatureStages instance) => <String, dynamic>{
  'billId': instance.billId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'motionId': ?instance.motionId,
  'onDate': ?instance.onDate?.toIso8601String(),
  'outcomeTerm': ?instance.outcomeTerm,
  'sequence': instance.sequence,
  'sittingId': ?instance.sittingId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
