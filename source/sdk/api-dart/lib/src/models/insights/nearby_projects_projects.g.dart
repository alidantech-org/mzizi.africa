// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'nearby_projects_projects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsNearbyProjectsProjects _$InsightsNearbyProjectsProjectsFromJson(Map<String, dynamic> json) => InsightsNearbyProjectsProjects(
  amount: (json['amount'] as num?)?.toDouble(),
  code: json['code'] as String,
  contractor: json['contractor'] as String?,
  distanceKm: (json['distance_km'] as num).toDouble(),
  location: json['location'],
  media: InsightsNearbyProjectsProjectsMedia.fromJson(json['media'] as Map<String, dynamic>),
  name: json['name'] as String,
  responsible: json['responsible'] as String?,
  status: json['status'] as String,
  unit: json['unit'] as String,
  unitId: json['unit_id'] as String,
  unitPath: json['unit_path'] as String,
);

Map<String, dynamic> _$InsightsNearbyProjectsProjectsToJson(InsightsNearbyProjectsProjects instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'code': instance.code,
  'contractor': ?instance.contractor,
  'distance_km': instance.distanceKm,
  'location': ?instance.location,
  'media': instance.media,
  'name': instance.name,
  'responsible': ?instance.responsible,
  'status': instance.status,
  'unit': instance.unit,
  'unit_id': instance.unitId,
  'unit_path': instance.unitPath,
};
