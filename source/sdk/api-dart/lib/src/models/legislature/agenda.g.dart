// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'agenda.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureAgenda _$LegislatureAgendaFromJson(Map<String, dynamic> json) => LegislatureAgenda(
  billId: json['billId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  motionId: json['motionId'] as String?,
  position: (json['position'] as num).toInt(),
  sittingId: json['sittingId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureAgendaToJson(LegislatureAgenda instance) => <String, dynamic>{
  'billId': ?instance.billId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'motionId': ?instance.motionId,
  'position': instance.position,
  'sittingId': instance.sittingId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
