// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'agenda.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceAgenda _$GovernanceAgendaFromJson(Map<String, dynamic> json) => GovernanceAgenda(
  agendaKindId: json['agendaKindId'] as String,
  billId: json['billId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  motionId: json['motionId'] as String?,
  position: (json['position'] as num).toInt(),
  sittingId: json['sittingId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceAgendaToJson(GovernanceAgenda instance) => <String, dynamic>{
  'agendaKindId': instance.agendaKindId,
  'billId': ?instance.billId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'motionId': ?instance.motionId,
  'position': instance.position,
  'sittingId': instance.sittingId,
  'sourceCitationId': ?instance.sourceCitationId,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
