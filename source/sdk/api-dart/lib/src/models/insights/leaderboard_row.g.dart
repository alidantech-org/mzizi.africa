// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leaderboard_row.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderboardRow _$InsightsLeaderboardRowFromJson(Map<String, dynamic> json) => InsightsLeaderboardRow(
  detail: json['detail'] as String?,
  featureId: json['featureId'] as String?,
  name: json['name'] as String,
  rank: (json['rank'] as num).toInt(),
  share: (json['share'] as num?)?.toDouble(),
  subjectId: json['subjectId'] as String?,
  value: (json['value'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsLeaderboardRowToJson(InsightsLeaderboardRow instance) => <String, dynamic>{
  'detail': ?instance.detail,
  'featureId': ?instance.featureId,
  'name': instance.name,
  'rank': instance.rank,
  'share': ?instance.share,
  'subjectId': ?instance.subjectId,
  'value': instance.value,
};
