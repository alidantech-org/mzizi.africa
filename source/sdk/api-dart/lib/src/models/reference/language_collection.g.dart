// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceLanguageCollection _$ReferenceLanguageCollectionFromJson(Map<String, dynamic> json) => ReferenceLanguageCollection(
  languages: (json['languages'] as List<dynamic>).map((e) => ReferenceLanguageEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceLanguageCollectionToJson(ReferenceLanguageCollection instance) => <String, dynamic>{
  'languages': instance.languages,
};
