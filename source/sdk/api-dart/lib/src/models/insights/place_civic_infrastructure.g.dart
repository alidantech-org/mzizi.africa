// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic_infrastructure.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivicInfrastructure _$InsightsPlaceCivicInfrastructureFromJson(Map<String, dynamic> json) => InsightsPlaceCivicInfrastructure(
  areaKm2: (json['areaKm2'] as num?)?.toDouble(),
  completed: (json['completed'] as num).toDouble(),
  completionRate: (json['completionRate'] as num?)?.toDouble(),
  per100k: (json['per100k'] as num?)?.toDouble(),
  perKm2: (json['perKm2'] as num?)?.toDouble(),
  population: (json['population'] as num?)?.toDouble(),
  projectShare: (json['projectShare'] as num?)?.toDouble(),
  projects: (json['projects'] as num).toDouble(),
  staffShare: (json['staffShare'] as num?)?.toDouble(),
);

Map<String, dynamic> _$InsightsPlaceCivicInfrastructureToJson(InsightsPlaceCivicInfrastructure instance) => <String, dynamic>{
  'areaKm2': ?instance.areaKm2,
  'completed': instance.completed,
  'completionRate': ?instance.completionRate,
  'per100k': ?instance.per100k,
  'perKm2': ?instance.perKm2,
  'population': ?instance.population,
  'projectShare': ?instance.projectShare,
  'projects': instance.projects,
  'staffShare': ?instance.staffShare,
};
