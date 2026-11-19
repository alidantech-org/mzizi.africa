// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic_projects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivicProjects _$InsightsPlaceCivicProjectsFromJson(Map<String, dynamic> json) => InsightsPlaceCivicProjects(
  amount: (json['amount'] as num?)?.toDouble(),
  code: json['code'] as String,
  completedOn: json['completed_on'] as String?,
  contractor: json['contractor'] as String?,
  location: json['location'],
  media: InsightsPlaceCivicProjectsMedia.fromJson(json['media'] as Map<String, dynamic>),
  name: json['name'] as String,
  startedOn: json['started_on'] as String,
  status: json['status'] as String,
  unit: json['unit'] as String,
  unitId: json['unit_id'] as String,
  unitPath: json['unit_path'] as String,
);

Map<String, dynamic> _$InsightsPlaceCivicProjectsToJson(InsightsPlaceCivicProjects instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'code': instance.code,
  'completed_on': ?instance.completedOn,
  'contractor': ?instance.contractor,
  'location': ?instance.location,
  'media': instance.media,
  'name': instance.name,
  'started_on': instance.startedOn,
  'status': instance.status,
  'unit': instance.unit,
  'unit_id': instance.unitId,
  'unit_path': instance.unitPath,
};
