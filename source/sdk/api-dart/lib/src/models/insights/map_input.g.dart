// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'map_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMapInput _$InsightsMapInputFromJson(Map<String, dynamic> json) => InsightsMapInput(
  indicatorCode: json['indicatorCode'] as String,
  kindCode: json['kindCode'] as String?,
  parentFeatureId: json['parentFeatureId'] as String?,
);

Map<String, dynamic> _$InsightsMapInputToJson(InsightsMapInput instance) => <String, dynamic>{
  'indicatorCode': instance.indicatorCode,
  'kindCode': ?instance.kindCode,
  'parentFeatureId': ?instance.parentFeatureId,
};
