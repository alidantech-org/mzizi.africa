// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail_motion.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetailMotion _$InsightsMotionDetailMotionFromJson(Map<String, dynamic> json) => InsightsMotionDetailMotion(
  code: json['code'] as String,
  contributions: (json['contributions'] as List<dynamic>)
      .map((e) => InsightsMotionDetailMotionContributions.fromJson(e as Map<String, dynamic>))
      .toList(),
  heldOn: json['held_on'] as String,
  institution: json['institution'] as String,
  institutionId: json['institution_id'] as String,
  kind: json['kind'] as String,
  movedBy: json['moved_by'] as String,
  outcome: json['outcome'] as String,
  sitting: json['sitting'] as String,
  summary: json['summary'] as String,
  title: json['title'] as String,
);

Map<String, dynamic> _$InsightsMotionDetailMotionToJson(InsightsMotionDetailMotion instance) => <String, dynamic>{
  'code': instance.code,
  'contributions': instance.contributions,
  'held_on': instance.heldOn,
  'institution': instance.institution,
  'institution_id': instance.institutionId,
  'kind': instance.kind,
  'moved_by': instance.movedBy,
  'outcome': instance.outcome,
  'sitting': instance.sitting,
  'summary': instance.summary,
  'title': instance.title,
};
