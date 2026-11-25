// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'point_query.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPointQuery _$GeographyPointQueryFromJson(Map<String, dynamic> json) =>
    GeographyPointQuery(latitude: (json['latitude'] as num).toDouble(), longitude: (json['longitude'] as num).toDouble());

Map<String, dynamic> _$GeographyPointQueryToJson(GeographyPointQuery instance) => <String, dynamic>{
  'latitude': instance.latitude,
  'longitude': instance.longitude,
};
