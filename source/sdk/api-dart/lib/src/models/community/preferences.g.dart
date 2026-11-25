// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'preferences.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityPreferences _$CommunityPreferencesFromJson(Map<String, dynamic> json) => CommunityPreferences(
  actorId: json['actorId'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  homeFeatureId: json['homeFeatureId'] as String?,
  id: json['id'] as String,
  languageId: json['languageId'] as String?,
  theme: $enumDecodeNullable(_$CommunityThemeChoiceEnumMap, json['theme']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityPreferencesToJson(CommunityPreferences instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'homeFeatureId': ?instance.homeFeatureId,
  'id': instance.id,
  'languageId': ?instance.languageId,
  'theme': ?_$CommunityThemeChoiceEnumMap[instance.theme],
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CommunityThemeChoiceEnumMap = {
  CommunityThemeChoice.dark: 'dark',
  CommunityThemeChoice.light: 'light',
  CommunityThemeChoice.system: 'system',
};
