// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'nearby_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsNearbyInput _$InsightsNearbyInputFromJson(Map<String, dynamic> json) => InsightsNearbyInput(
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  radiusKm: (json['radiusKm'] as num?)?.toDouble(),
);

Map<String, dynamic> _$InsightsNearbyInputToJson(InsightsNearbyInput instance) => <String, dynamic>{
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'radiusKm': ?instance.radiusKm,
};
