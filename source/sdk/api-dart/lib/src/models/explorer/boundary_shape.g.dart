// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'boundary_shape.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerBoundaryShape _$ExplorerBoundaryShapeFromJson(Map<String, dynamic> json) => ExplorerBoundaryShape(
  address: json['address'] as String,
  bbox: (json['bbox'] as List<dynamic>).map((e) => (e as num).toDouble()).toList(),
  childCount: (json['childCount'] as num).toInt(),
  geometry: json['geometry'] as String,
  kind: json['kind'] as String,
  kindCode: json['kindCode'] as String,
  name: json['name'] as String,
  population: (json['population'] as num?)?.toDouble(),
);

Map<String, dynamic> _$ExplorerBoundaryShapeToJson(ExplorerBoundaryShape instance) => <String, dynamic>{
  'address': instance.address,
  'bbox': instance.bbox,
  'childCount': instance.childCount,
  'geometry': instance.geometry,
  'kind': instance.kind,
  'kindCode': instance.kindCode,
  'name': instance.name,
  'population': ?instance.population,
};
