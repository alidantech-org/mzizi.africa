// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceSchemeCollection _$ReferenceSchemeCollectionFromJson(Map<String, dynamic> json) => ReferenceSchemeCollection(
  schemes: (json['schemes'] as List<dynamic>).map((e) => ReferenceSchemeEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ReferenceSchemeCollectionToJson(ReferenceSchemeCollection instance) => <String, dynamic>{'schemes': instance.schemes};
