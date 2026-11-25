// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicFacilityCollection _$CivicFacilityCollectionFromJson(Map<String, dynamic> json) => CivicFacilityCollection(
  facilities: (json['facilities'] as List<dynamic>).map((e) => CivicFacilityEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$CivicFacilityCollectionToJson(CivicFacilityCollection instance) => <String, dynamic>{'facilities': instance.facilities};
