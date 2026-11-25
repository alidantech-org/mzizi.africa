// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicProjectCollection _$CivicProjectCollectionFromJson(Map<String, dynamic> json) => CivicProjectCollection(
  projects: (json['projects'] as List<dynamic>).map((e) => CivicProjectEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$CivicProjectCollectionToJson(CivicProjectCollection instance) => <String, dynamic>{'projects': instance.projects};
