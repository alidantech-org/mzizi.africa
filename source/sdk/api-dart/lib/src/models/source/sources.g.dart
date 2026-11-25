// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sources.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceSources _$SourceSourcesFromJson(Map<String, dynamic> json) => SourceSources(
  classTerm: json['classTerm'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  credentialBinding: json['credentialBinding'] as String?,
  credibilityTerm: json['credibilityTerm'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kind: $enumDecode(_$SourceSourceKindEnumMap, json['kind']),
  label: json['label'] as String,
  licenceTerm: json['licenceTerm'] as String?,
  publisherId: json['publisherId'] as String,
  termsUrl: json['termsUrl'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceSourcesToJson(SourceSources instance) => <String, dynamic>{
  'classTerm': ?instance.classTerm,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'credentialBinding': ?instance.credentialBinding,
  'credibilityTerm': ?instance.credibilityTerm,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kind': _$SourceSourceKindEnumMap[instance.kind]!,
  'label': instance.label,
  'licenceTerm': ?instance.licenceTerm,
  'publisherId': instance.publisherId,
  'termsUrl': ?instance.termsUrl,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceSourceKindEnumMap = {
  SourceSourceKind.api: 'api',
  SourceSourceKind.feed: 'feed',
  SourceSourceKind.portal: 'portal',
  SourceSourceKind.website: 'website',
};
