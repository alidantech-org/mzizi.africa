// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_child.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceChild _$InsightsPlaceChildFromJson(Map<String, dynamic> json) => InsightsPlaceChild(
  childCount: (json['childCount'] as num).toInt(),
  featureId: json['featureId'] as String,
  kindCode: json['kindCode'] as String,
  kindLabel: json['kindLabel'] as String,
  name: json['name'] as String,
  path: json['path'] as String?,
  population: (json['population'] as num?)?.toDouble(),
);

Map<String, dynamic> _$InsightsPlaceChildToJson(InsightsPlaceChild instance) => <String, dynamic>{
  'childCount': instance.childCount,
  'featureId': instance.featureId,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
  'path': ?instance.path,
  'population': ?instance.population,
};
