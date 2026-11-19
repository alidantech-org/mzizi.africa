// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_activity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileActivity _$InsightsLeaderProfileActivityFromJson(Map<String, dynamic> json) => InsightsLeaderProfileActivity(
  contributions: InsightsLeaderProfileActivityContributions.fromJson(json['contributions'] as Map<String, dynamic>),
  recent: (json['recent'] as List<dynamic>).map((e) => InsightsLeaderProfileActivityRecent.fromJson(e as Map<String, dynamic>)).toList(),
  recorded: json['recorded'] as bool,
  speeches: (json['speeches'] as List<dynamic>).map((e) => InsightsLeaderProfileActivitySpeeches.fromJson(e as Map<String, dynamic>)).toList(),
  votes: InsightsLeaderProfileActivityVotes.fromJson(json['votes'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsLeaderProfileActivityToJson(InsightsLeaderProfileActivity instance) => <String, dynamic>{
  'contributions': instance.contributions,
  'recent': instance.recent,
  'recorded': instance.recorded,
  'speeches': instance.speeches,
  'votes': instance.votes,
};
