// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_at_point.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPlaceAtPoint _$GeographyPlaceAtPointFromJson(Map<String, dynamic> json) => GeographyPlaceAtPoint(
  places: (json['places'] as List<dynamic>).map((e) => GeographyPlaceEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyPlaceAtPointToJson(GeographyPlaceAtPoint instance) => <String, dynamic>{'places': instance.places};
