// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options_nearby.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptionsNearby _$InsightsCompareOptionsNearbyFromJson(Map<String, dynamic> json) => InsightsCompareOptionsNearby(
  distanceKm: (json['distanceKm'] as num).toDouble(),
  featureId: json['featureId'] as String,
  kindLabel: json['kindLabel'] as String,
  name: json['name'] as String,
  path: json['path'] as String,
);

Map<String, dynamic> _$InsightsCompareOptionsNearbyToJson(InsightsCompareOptionsNearby instance) => <String, dynamic>{
  'distanceKm': instance.distanceKm,
  'featureId': instance.featureId,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
  'path': instance.path,
};
