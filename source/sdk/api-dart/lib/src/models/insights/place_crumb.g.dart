// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_crumb.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCrumb _$InsightsPlaceCrumbFromJson(Map<String, dynamic> json) => InsightsPlaceCrumb(
  featureId: json['featureId'] as String,
  kindCode: json['kindCode'] as String,
  kindLabel: json['kindLabel'] as String,
  name: json['name'] as String,
  path: json['path'] as String?,
);

Map<String, dynamic> _$InsightsPlaceCrumbToJson(InsightsPlaceCrumb instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
  'path': ?instance.path,
};
