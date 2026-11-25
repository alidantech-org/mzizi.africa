// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'observation_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsObservationCollection _$StatisticsObservationCollectionFromJson(Map<String, dynamic> json) => StatisticsObservationCollection(
  observations: (json['observations'] as List<dynamic>).map((e) => StatisticsObservationEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$StatisticsObservationCollectionToJson(StatisticsObservationCollection instance) => <String, dynamic>{
  'observations': instance.observations,
};
