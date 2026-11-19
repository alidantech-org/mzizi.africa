// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections_registration_trend.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElectionsRegistrationTrend _$InsightsPlaceElectionsRegistrationTrendFromJson(Map<String, dynamic> json) =>
    InsightsPlaceElectionsRegistrationTrend(
      estimated: json['estimated'] as bool,
      period: json['period'] as String,
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceElectionsRegistrationTrendToJson(InsightsPlaceElectionsRegistrationTrend instance) => <String, dynamic>{
  'estimated': instance.estimated,
  'period': instance.period,
  'value': instance.value,
};
