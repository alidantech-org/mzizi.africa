// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'position_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityPositionInput _$LocalityPositionInputFromJson(Map<String, dynamic> json) => LocalityPositionInput(
  languageCode: json['languageCode'] as String?,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
);

Map<String, dynamic> _$LocalityPositionInputToJson(LocalityPositionInput instance) => <String, dynamic>{
  'languageCode': ?instance.languageCode,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'onDate': ?instance.onDate?.toIso8601String(),
};
