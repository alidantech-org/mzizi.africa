// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'speeches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceSpeeches _$GovernanceSpeechesFromJson(Map<String, dynamic> json) => GovernanceSpeeches(
  billId: json['billId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  hansardId: json['hansardId'] as String?,
  holderId: json['holderId'] as String,
  id: json['id'] as String,
  motionId: json['motionId'] as String?,
  pageReference: json['pageReference'] as String?,
  position: (json['position'] as num).toInt(),
  sittingId: json['sittingId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  speechKindId: json['speechKindId'] as String,
  summary: json['summary'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  wordCount: (json['wordCount'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceSpeechesToJson(GovernanceSpeeches instance) => <String, dynamic>{
  'billId': ?instance.billId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'hansardId': ?instance.hansardId,
  'holderId': instance.holderId,
  'id': instance.id,
  'motionId': ?instance.motionId,
  'pageReference': ?instance.pageReference,
  'position': instance.position,
  'sittingId': instance.sittingId,
  'sourceCitationId': ?instance.sourceCitationId,
  'speechKindId': instance.speechKindId,
  'summary': ?instance.summary,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'wordCount': ?instance.wordCount,
};
