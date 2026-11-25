// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'release_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductReleaseCollection _$ProductReleaseCollectionFromJson(Map<String, dynamic> json) => ProductReleaseCollection(
  releases: (json['releases'] as List<dynamic>).map((e) => ProductReleaseEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ProductReleaseCollectionToJson(ProductReleaseCollection instance) => <String, dynamic>{'releases': instance.releases};
