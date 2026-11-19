// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_activity_speeches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileActivitySpeeches _$InsightsLeaderProfileActivitySpeechesFromJson(Map<String, dynamic> json) =>
    InsightsLeaderProfileActivitySpeeches(
      heldOn: json['held_on'] as String,
      kind: json['kind'] as String,
      motion: json['motion'] as String,
      motionCode: json['motion_code'] as String,
      summary: json['summary'] as String,
      wordCount: (json['word_count'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsLeaderProfileActivitySpeechesToJson(InsightsLeaderProfileActivitySpeeches instance) => <String, dynamic>{
  'held_on': instance.heldOn,
  'kind': instance.kind,
  'motion': instance.motion,
  'motion_code': instance.motionCode,
  'summary': instance.summary,
  'word_count': instance.wordCount,
};
