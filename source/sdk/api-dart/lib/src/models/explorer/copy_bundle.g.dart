// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'copy_bundle.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerCopyBundle _$ExplorerCopyBundleFromJson(Map<String, dynamic> json) => ExplorerCopyBundle(
  entries: (json['entries'] as List<dynamic>).map((e) => ExplorerCopyEntry.fromJson(e as Map<String, dynamic>)).toList(),
  hash: json['hash'] as String,
  language: json['language'] as String,
  missing: (json['missing'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$ExplorerCopyBundleToJson(ExplorerCopyBundle instance) => <String, dynamic>{
  'entries': instance.entries,
  'hash': instance.hash,
  'language': instance.language,
  'missing': instance.missing,
};
