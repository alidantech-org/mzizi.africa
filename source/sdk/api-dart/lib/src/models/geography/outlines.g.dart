// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outlines.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyOutlines _$GeographyOutlinesFromJson(Map<String, dynamic> json) => GeographyOutlines(
  band: (json['band'] as num).toInt(),
  bbox: json['bbox'],
  builtAt: DateTime.parse(json['builtAt'] as String),
  centroid: json['centroid'],
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  geometry: json['geometry'],
  geometryId: json['geometryId'] as String,
  id: json['id'] as String,
  points: (json['points'] as num).toInt(),
  tolerance: (json['tolerance'] as num).toDouble(),
);

Map<String, dynamic> _$GeographyOutlinesToJson(GeographyOutlines instance) => <String, dynamic>{
  'band': instance.band,
  'bbox': ?instance.bbox,
  'builtAt': instance.builtAt.toIso8601String(),
  'centroid': ?instance.centroid,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'geometry': ?instance.geometry,
  'geometryId': instance.geometryId,
  'id': instance.id,
  'points': instance.points,
  'tolerance': instance.tolerance,
};
