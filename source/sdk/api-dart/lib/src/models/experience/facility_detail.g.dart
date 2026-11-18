// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFacilityDetail _$ExperienceFacilityDetailFromJson(Map<String, dynamic> json) => ExperienceFacilityDetail(
  chain: (json['chain'] as List<dynamic>).map((e) => ExperiencePlaceRef.fromJson(e as Map<String, dynamic>)).toList(),
  facility: ExperienceFacilityRow.fromJson(json['facility'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  stations: (json['stations'] as List<dynamic>).map((e) => ExperienceHostedStation.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ExperienceFacilityDetailToJson(ExperienceFacilityDetail instance) => <String, dynamic>{
  'chain': instance.chain,
  'facility': instance.facility,
  'gaps': instance.gaps,
  'stations': instance.stations,
};
