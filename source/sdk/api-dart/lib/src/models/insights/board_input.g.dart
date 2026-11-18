// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'board_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsBoardInput _$InsightsBoardInputFromJson(Map<String, dynamic> json) => InsightsBoardInput(
  kindCode: json['kindCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  metricCode: json['metricCode'] as String,
  parentFeatureId: json['parentFeatureId'] as String?,
);

Map<String, dynamic> _$InsightsBoardInputToJson(InsightsBoardInput instance) => <String, dynamic>{
  'kindCode': ?instance.kindCode,
  'limit': ?instance.limit,
  'metricCode': instance.metricCode,
  'parentFeatureId': ?instance.parentFeatureId,
};
