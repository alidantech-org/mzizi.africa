// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_list_motions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionListMotions _$InsightsMotionListMotionsFromJson(Map<String, dynamic> json) => InsightsMotionListMotions(
  absent: (json['absent'] as num).toDouble(),
  abstain: (json['abstain'] as num).toDouble(),
  code: json['code'] as String,
  heldOn: json['held_on'] as String,
  institution: json['institution'] as String,
  institutionId: json['institution_id'] as String,
  kind: json['kind'] as String,
  no: (json['no'] as num).toDouble(),
  outcome: json['outcome'] as String,
  summary: json['summary'] as String,
  title: json['title'] as String,
  yes: (json['yes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsMotionListMotionsToJson(InsightsMotionListMotions instance) => <String, dynamic>{
  'absent': instance.absent,
  'abstain': instance.abstain,
  'code': instance.code,
  'held_on': instance.heldOn,
  'institution': instance.institution,
  'institution_id': instance.institutionId,
  'kind': instance.kind,
  'no': instance.no,
  'outcome': instance.outcome,
  'summary': instance.summary,
  'title': instance.title,
  'yes': instance.yes,
};
