// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_detail_holders_steps.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeDetailHoldersSteps _$GovernanceOfficeDetailHoldersStepsFromJson(Map<String, dynamic> json) => GovernanceOfficeDetailHoldersSteps(
  actorCode: json['actorCode'] as String,
  actorHolderId: json['actorHolderId'] as String?,
  actorId: json['actorId'] as String,
  motionId: json['motionId'] as String?,
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
  step: $enumDecode(_$GovernanceAppointmentStepEnumMap, json['step']),
);

Map<String, dynamic> _$GovernanceOfficeDetailHoldersStepsToJson(GovernanceOfficeDetailHoldersSteps instance) => <String, dynamic>{
  'actorCode': instance.actorCode,
  'actorHolderId': ?instance.actorHolderId,
  'actorId': instance.actorId,
  'motionId': ?instance.motionId,
  'onDate': ?instance.onDate?.toIso8601String(),
  'step': _$GovernanceAppointmentStepEnumMap[instance.step]!,
};

const _$GovernanceAppointmentStepEnumMap = {
  GovernanceAppointmentStep.appointment: 'appointment',
  GovernanceAppointmentStep.approval: 'approval',
  GovernanceAppointmentStep.nomination: 'nomination',
  GovernanceAppointmentStep.recommendation: 'recommendation',
  GovernanceAppointmentStep.swearingIn: 'swearing-in',
  GovernanceAppointmentStep.vetting: 'vetting',
};
