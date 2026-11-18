// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facility_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFacilityList _$ExperienceFacilityListFromJson(Map<String, dynamic> json) => ExperienceFacilityList(
  classes: (json['classes'] as List<dynamic>).map((e) => ExperienceClassCount.fromJson(e as Map<String, dynamic>)).toList(),
  facilities: (json['facilities'] as List<dynamic>).map((e) => ExperienceFacilityRow.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$ExperienceFacilityListToJson(ExperienceFacilityList instance) => <String, dynamic>{
  'classes': instance.classes,
  'facilities': instance.facilities,
  'gaps': instance.gaps,
  'total': instance.total,
};
