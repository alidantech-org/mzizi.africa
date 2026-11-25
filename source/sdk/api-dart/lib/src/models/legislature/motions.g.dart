// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureMotions _$LegislatureMotionsFromJson(Map<String, dynamic> json) => LegislatureMotions(
  billId: json['billId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String?,
  kindTerm: json['kindTerm'] as String,
  moverId: json['moverId'] as String?,
  outcomeTerm: json['outcomeTerm'] as String?,
  periodId: json['periodId'] as String?,
  provisionId: json['provisionId'] as String?,
  revisionId: json['revisionId'] as String?,
  sittingId: json['sittingId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureMotionsToJson(LegislatureMotions instance) => <String, dynamic>{
  'billId': ?instance.billId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'instrumentId': ?instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'moverId': ?instance.moverId,
  'outcomeTerm': ?instance.outcomeTerm,
  'periodId': ?instance.periodId,
  'provisionId': ?instance.provisionId,
  'revisionId': ?instance.revisionId,
  'sittingId': instance.sittingId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
