// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'patterns.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePatterns _$GovernancePatternsFromJson(Map<String, dynamic> json) => GovernancePatterns(
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernancePatternsToJson(GovernancePatterns instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kindTerm': ?instance.kindTerm,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
