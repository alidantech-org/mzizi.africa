// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'variations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicVariations _$CivicVariationsFromJson(Map<String, dynamic> json) => CivicVariations(
  amountChange: (json['amountChange'] as num?)?.toInt(),
  code: json['code'] as String,
  contractId: json['contractId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  newEndOn: json['newEndOn'] == null ? null : DateTime.parse(json['newEndOn'] as String),
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  signedOn: json['signedOn'] == null ? null : DateTime.parse(json['signedOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicVariationsToJson(CivicVariations instance) => <String, dynamic>{
  'amountChange': ?instance.amountChange,
  'code': instance.code,
  'contractId': instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'newEndOn': ?instance.newEndOn?.toIso8601String(),
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'signedOn': ?instance.signedOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
