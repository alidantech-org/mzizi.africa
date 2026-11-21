// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'address_place.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerAddressPlace _$ExplorerAddressPlaceFromJson(Map<String, dynamic> json) => ExplorerAddressPlace(
  address: json['address'] as String,
  place: json['place'] == null ? null : ExplorerPlace.fromJson(json['place'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ExplorerAddressPlaceToJson(ExplorerAddressPlace instance) => <String, dynamic>{
  'address': instance.address,
  'place': ?instance.place,
};
