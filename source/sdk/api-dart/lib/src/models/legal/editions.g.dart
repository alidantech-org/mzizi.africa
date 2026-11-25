// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'editions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalEditions _$LegalEditionsFromJson(Map<String, dynamic> json) => LegalEditions(
  ceasedOn: json['ceasedOn'] == null ? null : DateTime.parse(json['ceasedOn'] as String),
  code: json['code'] as String,
  commencedOn: json['commencedOn'] == null ? null : DateTime.parse(json['commencedOn'] as String),
  consolidatedOn: json['consolidatedOn'] == null ? null : DateTime.parse(json['consolidatedOn'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  designation: json['designation'] as String,
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String,
  repealedOn: json['repealedOn'] == null ? null : DateTime.parse(json['repealedOn'] as String),
  supersedesId: json['supersedesId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalEditionsToJson(LegalEditions instance) => <String, dynamic>{
  'ceasedOn': ?instance.ceasedOn?.toIso8601String(),
  'code': instance.code,
  'commencedOn': ?instance.commencedOn?.toIso8601String(),
  'consolidatedOn': ?instance.consolidatedOn?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'designation': instance.designation,
  'id': instance.id,
  'instrumentId': instance.instrumentId,
  'repealedOn': ?instance.repealedOn?.toIso8601String(),
  'supersedesId': ?instance.supersedesId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
