// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'messages.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductMessages _$ProductMessagesFromJson(Map<String, dynamic> json) => ProductMessages(
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  keyId: json['keyId'] as String,
  languageId: json['languageId'] as String,
  origin: $enumDecode(_$ProductTextOriginEnumMap, json['origin']),
  status: $enumDecode(_$ProductMessageStatusEnumMap, json['status']),
  text: json['text'] as String,
  translator: json['translator'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ProductMessagesToJson(ProductMessages instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'keyId': instance.keyId,
  'languageId': instance.languageId,
  'origin': _$ProductTextOriginEnumMap[instance.origin]!,
  'status': _$ProductMessageStatusEnumMap[instance.status]!,
  'text': instance.text,
  'translator': ?instance.translator,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$ProductTextOriginEnumMap = {
  ProductTextOrigin.human: 'human',
  ProductTextOrigin.machine: 'machine',
  ProductTextOrigin.original: 'original',
};

const _$ProductMessageStatusEnumMap = {
  ProductMessageStatus.draft: 'draft',
  ProductMessageStatus.published: 'published',
  ProductMessageStatus.reviewed: 'reviewed',
};
