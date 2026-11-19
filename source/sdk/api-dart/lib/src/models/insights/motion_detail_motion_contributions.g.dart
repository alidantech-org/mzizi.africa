// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail_motion_contributions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetailMotionContributions _$InsightsMotionDetailMotionContributionsFromJson(Map<String, dynamic> json) =>
    InsightsMotionDetailMotionContributions(
      holderId: json['holder_id'] as String,
      kind: json['kind'] as String,
      name: json['name'] as String,
      party: json['party'] as String?,
      summary: json['summary'] as String,
      wordCount: (json['word_count'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsMotionDetailMotionContributionsToJson(InsightsMotionDetailMotionContributions instance) => <String, dynamic>{
  'holder_id': instance.holderId,
  'kind': instance.kind,
  'name': instance.name,
  'party': ?instance.party,
  'summary': instance.summary,
  'word_count': instance.wordCount,
};
