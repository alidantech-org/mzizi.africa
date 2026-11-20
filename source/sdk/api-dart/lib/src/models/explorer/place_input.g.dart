// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerPlaceInput _$ExplorerPlaceInputFromJson(Map<String, dynamic> json) => ExplorerPlaceInput(
  countryCode: json['countryCode'] as String,
  featureId: json['featureId'] as String?,
  languageCode: json['languageCode'] as String?,
  path: json['path'] as String?,
);

Map<String, dynamic> _$ExplorerPlaceInputToJson(ExplorerPlaceInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'featureId': ?instance.featureId,
  'languageCode': ?instance.languageCode,
  'path': ?instance.path,
};
