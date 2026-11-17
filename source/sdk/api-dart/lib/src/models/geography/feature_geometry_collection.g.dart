// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_geometry_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureGeometryCollection _$GeographyFeatureGeometryCollectionFromJson(Map<String, dynamic> json) => GeographyFeatureGeometryCollection(
  geometries: (json['geometries'] as List<dynamic>).map((e) => GeographyFeatureGeometry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyFeatureGeometryCollectionToJson(GeographyFeatureGeometryCollection instance) => <String, dynamic>{
  'geometries': instance.geometries,
};
