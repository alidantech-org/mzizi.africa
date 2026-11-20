// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coordinates_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerCoordinatesInput _$ExplorerCoordinatesInputFromJson(Map<String, dynamic> json) => ExplorerCoordinatesInput(
  accuracyMeters: (json['accuracyMeters'] as num?)?.toDouble(),
  countryCode: json['countryCode'] as String?,
  languageCode: json['languageCode'] as String?,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
);

Map<String, dynamic> _$ExplorerCoordinatesInputToJson(ExplorerCoordinatesInput instance) => <String, dynamic>{
  'accuracyMeters': ?instance.accuracyMeters,
  'countryCode': ?instance.countryCode,
  'languageCode': ?instance.languageCode,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
};
