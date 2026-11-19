// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail_project.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsProjectDetailProject _$InsightsProjectDetailProjectFromJson(Map<String, dynamic> json) => InsightsProjectDetailProject(
  code: json['code'] as String,
  completedOn: json['completed_on'] as String?,
  description: json['description'] as String,
  location: json['location'],
  name: json['name'] as String,
  responsible: json['responsible'] as String?,
  startedOn: json['started_on'] as String,
  status: json['status'] as String,
  unit: json['unit'] as String,
  unitId: json['unit_id'] as String,
  unitPath: json['unit_path'] as String,
);

Map<String, dynamic> _$InsightsProjectDetailProjectToJson(InsightsProjectDetailProject instance) => <String, dynamic>{
  'code': instance.code,
  'completed_on': ?instance.completedOn,
  'description': instance.description,
  'location': ?instance.location,
  'name': instance.name,
  'responsible': ?instance.responsible,
  'started_on': instance.startedOn,
  'status': instance.status,
  'unit': instance.unit,
  'unit_id': instance.unitId,
  'unit_path': instance.unitPath,
};
