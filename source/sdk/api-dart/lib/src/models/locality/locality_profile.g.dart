// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'locality_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityLocalityProfile _$LocalityLocalityProfileFromJson(Map<String, dynamic> json) => LocalityLocalityProfile(
  chain: (json['chain'] as List<dynamic>).map((e) => LocalityLocalityUnit.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  languageRequested: json['languageRequested'] as String?,
  languageServed: json['languageServed'] as String,
  media: (json['media'] as List<dynamic>).map((e) => LocalityMediaRef.fromJson(e as Map<String, dynamic>)).toList(),
  officials: (json['officials'] as List<dynamic>).map((e) => LocalityOfficeHolder.fromJson(e as Map<String, dynamic>)).toList(),
  place: LocalityLocalityUnit.fromJson(json['place'] as Map<String, dynamic>),
  procurement: LocalityProcurementSummary.fromJson(json['procurement'] as Map<String, dynamic>),
);

Map<String, dynamic> _$LocalityLocalityProfileToJson(LocalityLocalityProfile instance) => <String, dynamic>{
  'chain': instance.chain,
  'gaps': instance.gaps,
  'languageRequested': ?instance.languageRequested,
  'languageServed': instance.languageServed,
  'media': instance.media,
  'officials': instance.officials,
  'place': instance.place,
  'procurement': instance.procurement,
};
