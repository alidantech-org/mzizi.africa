// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'child_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChildCollection _$GeographyChildCollectionFromJson(Map<String, dynamic> json) => GeographyChildCollection(
  children: (json['children'] as List<dynamic>).map((e) => GeographyChildEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyChildCollectionToJson(GeographyChildCollection instance) => <String, dynamic>{'children': instance.children};
