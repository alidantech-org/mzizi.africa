// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'child_outline_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChildOutlineCollection _$GeographyChildOutlineCollectionFromJson(Map<String, dynamic> json) => GeographyChildOutlineCollection(
  children: (json['children'] as List<dynamic>).map((e) => GeographyChildOutlineEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyChildOutlineCollectionToJson(GeographyChildOutlineCollection instance) => <String, dynamic>{
  'children': instance.children,
};
