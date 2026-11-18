// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'copy.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCopy _$ReferenceCopyFromJson(Map<String, dynamic> json) => ReferenceCopy(
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  isDevelopmentText: json['isDevelopmentText'] as bool,
  key: json['key'] as String,
  languageId: json['languageId'] as String,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceCopyToJson(ReferenceCopy instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'isDevelopmentText': instance.isDevelopmentText,
  'key': instance.key,
  'languageId': instance.languageId,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
