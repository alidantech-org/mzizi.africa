// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'paths.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourcePaths _$SourcePathsFromJson(Map<String, dynamic> json) => SourcePaths(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  domainId: json['domainId'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$SourcePathKindEnumMap, json['kind']),
  method: $enumDecodeNullable(_$SourceHttpMethodEnumMap, json['method']),
  note: json['note'] as String?,
  path: json['path'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourcePathsToJson(SourcePaths instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'domainId': instance.domainId,
  'id': instance.id,
  'kind': _$SourcePathKindEnumMap[instance.kind]!,
  'method': ?_$SourceHttpMethodEnumMap[instance.method],
  'note': ?instance.note,
  'path': instance.path,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourcePathKindEnumMap = {
  SourcePathKind.endpoint: 'endpoint',
  SourcePathKind.file: 'file',
  SourcePathKind.listing: 'listing',
  SourcePathKind.page: 'page',
};

const _$SourceHttpMethodEnumMap = {SourceHttpMethod.get: 'GET', SourceHttpMethod.head: 'HEAD', SourceHttpMethod.post: 'POST'};
