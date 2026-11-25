// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hierarchy_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceHierarchyCollection _$ReferenceHierarchyCollectionFromJson(Map<String, dynamic> json) => ReferenceHierarchyCollection(
  hierarchies: (json['hierarchies'] as List<dynamic>).map((e) => ReferenceHierarchyEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceHierarchyCollectionToJson(ReferenceHierarchyCollection instance) => <String, dynamic>{
  'hierarchies': instance.hierarchies,
};
