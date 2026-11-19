// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'law_instrument.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLawInstrument _$InsightsLawInstrumentFromJson(Map<String, dynamic> json) => InsightsLawInstrument(
  code: json['code'] as String,
  enactedOn: json['enactedOn'] == null ? null : DateTime.parse(json['enactedOn'] as String),
  kindCode: json['kindCode'] as String,
  kindLabel: json['kindLabel'] as String,
  name: json['name'] as String,
  provisions: (json['provisions'] as num).toInt(),
);

Map<String, dynamic> _$InsightsLawInstrumentToJson(InsightsLawInstrument instance) => <String, dynamic>{
  'code': instance.code,
  'enactedOn': ?instance.enactedOn?.toIso8601String(),
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
  'provisions': instance.provisions,
};
