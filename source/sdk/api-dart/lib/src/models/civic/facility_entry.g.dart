// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicFacilityEntry _$CivicFacilityEntryFromJson(Map<String, dynamic> json) => CivicFacilityEntry(
  classTerm: json['classTerm'] as String,
  code: json['code'] as String,
  facilityId: json['facilityId'] as String,
  names: (json['names'] as List<dynamic>).map((e) => CivicFacilityEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  ownershipTerm: json['ownershipTerm'] as String?,
  statusTerm: json['statusTerm'] as String?,
);

Map<String, dynamic> _$CivicFacilityEntryToJson(CivicFacilityEntry instance) => <String, dynamic>{
  'classTerm': instance.classTerm,
  'code': instance.code,
  'facilityId': instance.facilityId,
  'names': instance.names,
  'ownershipTerm': ?instance.ownershipTerm,
  'statusTerm': ?instance.statusTerm,
};
