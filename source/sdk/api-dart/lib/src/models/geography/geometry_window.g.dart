// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geometry_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyGeometryWindow _$GeographyGeometryWindowFromJson(Map<String, dynamic> json) => GeographyGeometryWindow(
  east: (json['east'] as num).toDouble(),
  featureTypeId: json['featureTypeId'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  north: (json['north'] as num).toDouble(),
  offset: (json['offset'] as num?)?.toInt(),
  simplifyTolerance: (json['simplifyTolerance'] as num?)?.toDouble(),
  south: (json['south'] as num).toDouble(),
  west: (json['west'] as num).toDouble(),
  zoom: (json['zoom'] as num).toInt(),
);

Map<String, dynamic> _$GeographyGeometryWindowToJson(GeographyGeometryWindow instance) => <String, dynamic>{
  'east': instance.east,
  'featureTypeId': ?instance.featureTypeId,
  'limit': ?instance.limit,
  'north': instance.north,
  'offset': ?instance.offset,
  'simplifyTolerance': ?instance.simplifyTolerance,
  'south': instance.south,
  'west': instance.west,
  'zoom': instance.zoom,
};
