// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SchemeCollection _$SchemeCollectionFromJson(Map<String, dynamic> json) =>
    SchemeCollection(
      schemes: (json['schemes'] as List<dynamic>)
          .map((e) => SchemeEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$SchemeCollectionToJson(SchemeCollection instance) =>
    <String, dynamic>{'schemes': instance.schemes};
