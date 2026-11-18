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
  id: json['id'] as String,
  obligationId: json['obligationId'] as String,
  periodFrom: json['periodFrom'] == null ? null : DateTime.parse(json['periodFrom'] as String),
  periodUntil: json['periodUntil'] == null ? null : DateTime.parse(json['periodUntil'] as String),
  reporterEntityId: json['reporterEntityId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  statusId: json['statusId'] as String,
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
  'id': instance.id,
  'obligationId': instance.obligationId,
  'periodFrom': ?instance.periodFrom?.toIso8601String(),
  'periodUntil': ?instance.periodUntil?.toIso8601String(),
  'reporterEntityId': instance.reporterEntityId,
  'sourceCitationId': ?instance.sourceCitationId,
  'statusId': instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
