// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fact_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFactList _$ExperienceFactListFromJson(Map<String, dynamic> json) => ExperienceFactList(
  facts: (json['facts'] as List<dynamic>).map((e) => ExperienceFactRow.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$ExperienceFactListToJson(ExperienceFactList instance) => <String, dynamic>{
  'facts': instance.facts,
  'gaps': instance.gaps,
};
