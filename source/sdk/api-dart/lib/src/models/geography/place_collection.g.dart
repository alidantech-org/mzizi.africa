// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPlaceCollection _$GeographyPlaceCollectionFromJson(Map<String, dynamic> json) => GeographyPlaceCollection(
  places: (json['places'] as List<dynamic>).map((e) => GeographyPlaceEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GeographyPlaceCollectionToJson(GeographyPlaceCollection instance) => <String, dynamic>{'places': instance.places};
