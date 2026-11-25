// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'observation_scope.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsObservationScope _$StatisticsObservationScopeFromJson(Map<String, dynamic> json) => StatisticsObservationScope(
  countryId: json['countryId'] as String,
  featureId: json['featureId'] as String,
  indicatorId: json['indicatorId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$StatisticsObservationScopeToJson(StatisticsObservationScope instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'featureId': instance.featureId,
  'indicatorId': instance.indicatorId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
