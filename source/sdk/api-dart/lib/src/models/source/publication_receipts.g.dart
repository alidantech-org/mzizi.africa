// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'publication_receipts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourcePublicationReceipts _$SourcePublicationReceiptsFromJson(Map<String, dynamic> json) => SourcePublicationReceipts(
  actorSnapshot: json['actorSnapshot'] as String,
  code: json['code'] as String,
  contractVersion: json['contractVersion'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  idempotencyKey: json['idempotencyKey'] as String,
  payloadHash: json['payloadHash'] as String,
  publicationRefId: json['publicationRefId'] as String,
  publishedAt: DateTime.parse(json['publishedAt'] as String),
  requestHash: json['requestHash'] as String,
  resultManifest: json['resultManifest'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourcePublicationReceiptsToJson(SourcePublicationReceipts instance) => <String, dynamic>{
  'actorSnapshot': instance.actorSnapshot,
  'code': instance.code,
  'contractVersion': instance.contractVersion,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'idempotencyKey': instance.idempotencyKey,
  'payloadHash': instance.payloadHash,
  'publicationRefId': instance.publicationRefId,
  'publishedAt': instance.publishedAt.toIso8601String(),
  'requestHash': instance.requestHash,
  'resultManifest': instance.resultManifest,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
