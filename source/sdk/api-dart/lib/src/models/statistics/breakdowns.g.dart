// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'breakdowns.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsBreakdowns _$StatisticsBreakdownsFromJson(Map<String, dynamic> json) => StatisticsBreakdowns(
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  id: json['id'] as String,
  observationId: json['observationId'] as String,
  schemeId: json['schemeId'] as String,
  termId: json['termId'] as String,
);

Map<String, dynamic> _$StatisticsBreakdownsToJson(StatisticsBreakdowns instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
  'observationId': instance.observationId,
  'schemeId': instance.schemeId,
  'termId': instance.termId,
};
