// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'domains.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDomains _$SourceDomainsFromJson(Map<String, dynamic> json) => SourceDomains(
  code: json['code'] as String,
  contactId: json['contactId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  host: json['host'] as String,
  id: json['id'] as String,
  lastCheckedAt: json['lastCheckedAt'] == null ? null : DateTime.parse(json['lastCheckedAt'] as String),
  ownerId: json['ownerId'] as String?,
  sourceId: json['sourceId'] as String?,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  statusTerm: json['statusTerm'] as String,
  templateId: json['templateId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceDomainsToJson(SourceDomains instance) => <String, dynamic>{
  'code': instance.code,
  'contactId': ?instance.contactId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'host': instance.host,
  'id': instance.id,
  'lastCheckedAt': ?instance.lastCheckedAt?.toIso8601String(),
  'ownerId': ?instance.ownerId,
  'sourceId': ?instance.sourceId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'templateId': ?instance.templateId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
