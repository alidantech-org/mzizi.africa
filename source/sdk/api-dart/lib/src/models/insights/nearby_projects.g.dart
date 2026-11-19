// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'nearby_projects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsNearbyProjects _$InsightsNearbyProjectsFromJson(Map<String, dynamic> json) => InsightsNearbyProjects(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  projects: (json['projects'] as List<dynamic>).map((e) => InsightsNearbyProjectsProjects.fromJson(e as Map<String, dynamic>)).toList(),
  radiusKm: (json['radiusKm'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsNearbyProjectsToJson(InsightsNearbyProjects instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'projects': instance.projects,
  'radiusKm': instance.radiusKm,
};
