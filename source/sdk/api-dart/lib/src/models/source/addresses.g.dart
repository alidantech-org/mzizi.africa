// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'addresses.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceAddresses _$SourceAddressesFromJson(Map<String, dynamic> json) => SourceAddresses(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  domainId: json['domainId'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$SourceAddressKindEnumMap, json['kind']),
  method: $enumDecode(_$SourceHttpMethodEnumMap, json['method']),
  note: json['note'] as String?,
  path: json['path'] as String,
  query: json['query'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceAddressesToJson(SourceAddresses instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'domainId': instance.domainId,
  'id': instance.id,
  'kind': _$SourceAddressKindEnumMap[instance.kind]!,
  'method': _$SourceHttpMethodEnumMap[instance.method]!,
  'note': ?instance.note,
  'path': instance.path,
  'query': instance.query,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceAddressKindEnumMap = {
  SourceAddressKind.endpoint: 'endpoint',
  SourceAddressKind.file: 'file',
  SourceAddressKind.listing: 'listing',
  SourceAddressKind.page: 'page',
};

const _$SourceHttpMethodEnumMap = {SourceHttpMethod.get: 'GET', SourceHttpMethod.head: 'HEAD', SourceHttpMethod.post: 'POST'};
