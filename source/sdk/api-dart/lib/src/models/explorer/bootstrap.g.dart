// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bootstrap.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerBootstrap _$ExplorerBootstrapFromJson(Map<String, dynamic> json) => ExplorerBootstrap(
  countries: (json['countries'] as List<dynamic>).map((e) => ExplorerCountryChoice.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  language: json['language'] as String,
  languages: (json['languages'] as List<dynamic>).map((e) => ExplorerLanguageChoice.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ExplorerBootstrapToJson(ExplorerBootstrap instance) => <String, dynamic>{
  'countries': instance.countries,
  'gaps': instance.gaps,
  'language': instance.language,
  'languages': instance.languages,
};
