// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'boundaries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerBoundaries _$ExplorerBoundariesFromJson(Map<String, dynamic> json) => ExplorerBoundaries(
  bbox: (json['bbox'] as List<dynamic>).map((e) => (e as num).toDouble()).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  place: ExplorerPlace.fromJson(json['place'] as Map<String, dynamic>),
  shapes: (json['shapes'] as List<dynamic>).map((e) => ExplorerBoundaryShape.fromJson(e as Map<String, dynamic>)).toList(),
  withoutBoundary: (json['withoutBoundary'] as num).toInt(),
);

Map<String, dynamic> _$ExplorerBoundariesToJson(ExplorerBoundaries instance) => <String, dynamic>{
  'bbox': instance.bbox,
  'gaps': instance.gaps,
  'place': instance.place,
  'shapes': instance.shapes,
  'withoutBoundary': instance.withoutBoundary,
};
