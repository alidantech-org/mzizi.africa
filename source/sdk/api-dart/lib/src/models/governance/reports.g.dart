// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reports.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceReports _$GovernanceReportsFromJson(Map<String, dynamic> json) => GovernanceReports(
  artifactId: json['artifactId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  dueOn: json['dueOn'] == null ? null : DateTime.parse(json['dueOn'] as String),
  filedOn: json['filedOn'] == null ? null : DateTime.parse(json['filedOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  obligationId: json['obligationId'] as String,
  reporterId: json['reporterId'] as String,
  statusTerm: json['statusTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceReportsToJson(GovernanceReports instance) => <String, dynamic>{
  'artifactId': ?instance.artifactId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'dueOn': ?instance.dueOn?.toIso8601String(),
  'filedOn': ?instance.filedOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'obligationId': instance.obligationId,
  'reporterId': instance.reporterId,
  'statusTerm': instance.statusTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
