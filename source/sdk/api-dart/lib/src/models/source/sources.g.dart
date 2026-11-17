// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sources.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceSources _$SourceSourcesFromJson(Map<String, dynamic> json) => SourceSources(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  credentialBinding: json['credentialBinding'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  id: json['id'] as String,
  kind: $enumDecode(_$SourceSourceKindEnumMap, json['kind']),
  officialEntityId: json['officialEntityId'] as String?,
  publisherId: json['publisherId'] as String,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceSourcesToJson(SourceSources instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'credentialBinding': ?instance.credentialBinding,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'id': instance.id,
  'kind': _$SourceSourceKindEnumMap[instance.kind]!,
  'officialEntityId': ?instance.officialEntityId,
  'publisherId': instance.publisherId,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceSourceKindEnumMap = {SourceSourceKind.api: 'api', SourceSourceKind.dataset: 'dataset', SourceSourceKind.website: 'website'};
