// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'copy_catalog.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCopyCatalog _$ExperienceCopyCatalogFromJson(Map<String, dynamic> json) => ExperienceCopyCatalog(
  entries: (json['entries'] as List<dynamic>).map((e) => ExperienceCopyEntry.fromJson(e as Map<String, dynamic>)).toList(),
  languageCode: json['languageCode'] as String,
);

Map<String, dynamic> _$ExperienceCopyCatalogToJson(ExperienceCopyCatalog instance) => <String, dynamic>{
  'entries': instance.entries,
  'languageCode': instance.languageCode,
};
