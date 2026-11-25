// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'branding.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialBranding _$OfficialBrandingFromJson(Map<String, dynamic> json) => OfficialBranding(
  colors: (json['colors'] as List<dynamic>?)?.map((e) => e as String).toList(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  kindTerm: json['kindTerm'] as String,
  languageId: json['languageId'] as String?,
  text: json['text'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialBrandingToJson(OfficialBranding instance) => <String, dynamic>{
  'colors': ?instance.colors,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'kindTerm': instance.kindTerm,
  'languageId': ?instance.languageId,
  'text': ?instance.text,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
