// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contacts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialContacts _$OfficialContactsFromJson(Map<String, dynamic> json) => OfficialContacts(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  kindTerm: json['kindTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  value: json['value'] as String,
  version: (json['version'] as num).toInt(),
  visibilityTerm: json['visibilityTerm'] as String,
);

Map<String, dynamic> _$OfficialContactsToJson(OfficialContacts instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'kindTerm': instance.kindTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'value': instance.value,
  'version': instance.version,
  'visibilityTerm': instance.visibilityTerm,
};
