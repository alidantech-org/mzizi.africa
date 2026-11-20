// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_choice.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerCountryChoice _$ExplorerCountryChoiceFromJson(Map<String, dynamic> json) => ExplorerCountryChoice(
  code: json['code'] as String,
  flagColors: (json['flagColors'] as List<dynamic>).map((e) => ExplorerFlagColor.fromJson(e as Map<String, dynamic>)).toList(),
  flagUrl: json['flagUrl'] as String?,
  id: json['id'] as String,
  name: json['name'] as String,
  rootFeatureId: json['rootFeatureId'] as String?,
  served: json['served'] as bool,
);

Map<String, dynamic> _$ExplorerCountryChoiceToJson(ExplorerCountryChoice instance) => <String, dynamic>{
  'code': instance.code,
  'flagColors': instance.flagColors,
  'flagUrl': ?instance.flagUrl,
  'id': instance.id,
  'name': instance.name,
  'rootFeatureId': ?instance.rootFeatureId,
  'served': instance.served,
};
