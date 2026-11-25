// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicProjectEntry _$CivicProjectEntryFromJson(Map<String, dynamic> json) => CivicProjectEntry(
  code: json['code'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  names: (json['names'] as List<dynamic>).map((e) => CivicProjectEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  projectId: json['projectId'] as String,
  siteKindTerm: json['siteKindTerm'] as String,
  statusTerm: json['statusTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$CivicProjectEntryToJson(CivicProjectEntry instance) => <String, dynamic>{
  'code': instance.code,
  'fromYear': ?instance.fromYear,
  'names': instance.names,
  'projectId': instance.projectId,
  'siteKindTerm': instance.siteKindTerm,
  'statusTerm': instance.statusTerm,
  'toYear': ?instance.toYear,
};
