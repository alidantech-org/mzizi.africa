// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetail _$InsightsMotionDetailFromJson(Map<String, dynamic> json) => InsightsMotionDetail(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  legal: json['legal'],
  members: json['members'] as List<dynamic>,
  motion: json['motion'],
  parties: json['parties'] as List<dynamic>,
  tally: json['tally'],
);

Map<String, dynamic> _$InsightsMotionDetailToJson(InsightsMotionDetail instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'legal': ?instance.legal,
  'members': instance.members,
  'motion': ?instance.motion,
  'parties': instance.parties,
  'tally': ?instance.tally,
};
