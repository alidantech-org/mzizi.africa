// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityPlaceInput _$LocalityPlaceInputFromJson(Map<String, dynamic> json) => LocalityPlaceInput(
  featureId: json['featureId'] as String,
  languageCode: json['languageCode'] as String?,
  onDate: json['onDate'] == null ? null : DateTime.parse(json['onDate'] as String),
);

Map<String, dynamic> _$LocalityPlaceInputToJson(LocalityPlaceInput instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'languageCode': ?instance.languageCode,
  'onDate': ?instance.onDate?.toIso8601String(),
};
