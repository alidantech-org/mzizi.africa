// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'speeches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureSpeeches _$LegislatureSpeechesFromJson(Map<String, dynamic> json) => LegislatureSpeeches(
  billId: json['billId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  hansardId: json['hansardId'] as String?,
  holderId: json['holderId'] as String?,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  motionId: json['motionId'] as String?,
  page: (json['page'] as num?)?.toInt(),
  position: (json['position'] as num).toInt(),
  sittingId: json['sittingId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  wordCount: (json['wordCount'] as num?)?.toInt(),
);

Map<String, dynamic> _$LegislatureSpeechesToJson(LegislatureSpeeches instance) => <String, dynamic>{
  'billId': ?instance.billId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'hansardId': ?instance.hansardId,
  'holderId': ?instance.holderId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'motionId': ?instance.motionId,
  'page': ?instance.page,
  'position': instance.position,
  'sittingId': instance.sittingId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'wordCount': ?instance.wordCount,
};
