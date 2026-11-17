// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureCollection _$GeographyFeatureCollectionFromJson(Map<String, dynamic> json) => GeographyFeatureCollection(
  features: (json['features'] as List<dynamic>).map((e) => GeographyFeatureEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyFeatureCollectionToJson(GeographyFeatureCollection instance) => <String, dynamic>{'features': instance.features};
