// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility_row.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFacilityRow _$ExperienceFacilityRowFromJson(Map<String, dynamic> json) => ExperienceFacilityRow(
  capacity: (json['capacity'] as List<dynamic>).map((e) => ExperienceCapacity.fromJson(e as Map<String, dynamic>)).toList(),
  classCode: json['classCode'] as String,
  classLabel: json['classLabel'] as String,
  code: json['code'] as String,
  domainCode: json['domainCode'] as String,
  domainLabel: json['domainLabel'] as String,
  featureId: json['featureId'] as String,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  name: json['name'] as String,
  operator: json['operator'] as String?,
  ownershipLabel: json['ownershipLabel'] as String?,
  placeName: json['placeName'] as String?,
  placePath: json['placePath'] as String?,
  statusLabel: json['statusLabel'] as String,
);

Map<String, dynamic> _$ExperienceFacilityRowToJson(ExperienceFacilityRow instance) => <String, dynamic>{
  'capacity': instance.capacity,
  'classCode': instance.classCode,
  'classLabel': instance.classLabel,
  'code': instance.code,
  'domainCode': instance.domainCode,
  'domainLabel': instance.domainLabel,
  'featureId': instance.featureId,
  'latitude': ?instance.latitude,
  'longitude': ?instance.longitude,
  'name': instance.name,
  'operator': ?instance.operator,
  'ownershipLabel': ?instance.ownershipLabel,
  'placeName': ?instance.placeName,
  'placePath': ?instance.placePath,
  'statusLabel': instance.statusLabel,
};
