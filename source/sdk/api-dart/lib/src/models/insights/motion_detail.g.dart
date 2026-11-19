// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetail _$InsightsMotionDetailFromJson(Map<String, dynamic> json) => InsightsMotionDetail(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  legal: InsightsMotionDetailLegal.fromJson(json['legal'] as Map<String, dynamic>),
  members: (json['members'] as List<dynamic>).map((e) => InsightsMotionDetailMembers.fromJson(e as Map<String, dynamic>)).toList(),
  motion: InsightsMotionDetailMotion.fromJson(json['motion'] as Map<String, dynamic>),
  parties: (json['parties'] as List<dynamic>).map((e) => InsightsMotionDetailParties.fromJson(e as Map<String, dynamic>)).toList(),
  tally: InsightsMotionDetailTally.fromJson(json['tally'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsMotionDetailToJson(InsightsMotionDetail instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'legal': instance.legal,
  'members': instance.members,
  'motion': instance.motion,
  'parties': instance.parties,
  'tally': instance.tally,
};
