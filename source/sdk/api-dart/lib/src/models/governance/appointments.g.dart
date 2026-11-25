// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'appointments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceAppointments _$GovernanceAppointmentsFromJson(Map<String, dynamic> json) => GovernanceAppointments(
  actorHolderId: json['actorHolderId'] as String?,
  actorId: json['actorId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  holderId: json['holderId'] as String,
  id: json['id'] as String,
  motionId: json['motionId'] as String?,
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
  step: $enumDecode(_$GovernanceAppointmentStepEnumMap, json['step']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceAppointmentsToJson(GovernanceAppointments instance) => <String, dynamic>{
  'actorHolderId': ?instance.actorHolderId,
  'actorId': instance.actorId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'holderId': instance.holderId,
  'id': instance.id,
  'motionId': ?instance.motionId,
  'onDate': ?instance.onDate?.toIso8601String(),
  'step': _$GovernanceAppointmentStepEnumMap[instance.step]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$GovernanceAppointmentStepEnumMap = {
  GovernanceAppointmentStep.appointment: 'appointment',
  GovernanceAppointmentStep.approval: 'approval',
  GovernanceAppointmentStep.nomination: 'nomination',
  GovernanceAppointmentStep.recommendation: 'recommendation',
  GovernanceAppointmentStep.swearingIn: 'swearing-in',
  GovernanceAppointmentStep.vetting: 'vetting',
};
