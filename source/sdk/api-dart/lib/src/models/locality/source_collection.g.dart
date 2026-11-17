// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'source_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalitySourceCollection _$LocalitySourceCollectionFromJson(Map<String, dynamic> json) => LocalitySourceCollection(
  sources: (json['sources'] as List<dynamic>).map((e) => LocalitySourceEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LocalitySourceCollectionToJson(LocalitySourceCollection instance) => <String, dynamic>{'sources': instance.sources};
