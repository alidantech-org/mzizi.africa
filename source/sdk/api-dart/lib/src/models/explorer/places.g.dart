// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'places.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerPlaces _$ExplorerPlacesFromJson(Map<String, dynamic> json) => ExplorerPlaces(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  limit: (json['limit'] as num).toInt(),
  page: (json['page'] as num).toInt(),
  places: (json['places'] as List<dynamic>).map((e) => ExplorerPlace.fromJson(e as Map<String, dynamic>)).toList(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$ExplorerPlacesToJson(ExplorerPlaces instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'limit': instance.limit,
  'page': instance.page,
  'places': instance.places,
  'total': instance.total,
};
