// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'locality_matches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityLocalityMatches _$LocalityLocalityMatchesFromJson(Map<String, dynamic> json) => LocalityLocalityMatches(
  places: (json['places'] as List<dynamic>).map((e) => LocalityLocalityUnit.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LocalityLocalityMatchesToJson(LocalityLocalityMatches instance) => <String, dynamic>{'places': instance.places};
