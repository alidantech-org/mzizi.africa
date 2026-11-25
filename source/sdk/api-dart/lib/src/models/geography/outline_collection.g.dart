// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outline_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyOutlineCollection _$GeographyOutlineCollectionFromJson(Map<String, dynamic> json) => GeographyOutlineCollection(
  outlines: (json['outlines'] as List<dynamic>).map((e) => GeographyOutlineEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyOutlineCollectionToJson(GeographyOutlineCollection instance) => <String, dynamic>{'outlines': instance.outlines};
