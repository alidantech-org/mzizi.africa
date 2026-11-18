// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fact_row.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFactRow _$ExperienceFactRowFromJson(Map<String, dynamic> json) => ExperienceFactRow(
  code: json['code'] as String,
  detail: json['detail'] as String?,
  place: json['place'] as String?,
  statement: json['statement'] as String,
  tagged: json['tagged'] as bool,
);

Map<String, dynamic> _$ExperienceFactRowToJson(ExperienceFactRow instance) => <String, dynamic>{
  'code': instance.code,
  'detail': ?instance.detail,
  'place': ?instance.place,
  'statement': instance.statement,
  'tagged': instance.tagged,
};
