// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'addresses.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerAddresses _$ExplorerAddressesFromJson(Map<String, dynamic> json) => ExplorerAddresses(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  places: (json['places'] as List<dynamic>).map((e) => ExplorerAddressPlace.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ExplorerAddressesToJson(ExplorerAddresses instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'places': instance.places,
};
