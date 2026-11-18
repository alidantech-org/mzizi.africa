// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'context_level.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceContextLevel _$ExperienceContextLevelFromJson(Map<String, dynamic> json) => ExperienceContextLevel(
  depth: (json['depth'] as num).toInt(),
  isRouting: json['isRouting'] as bool,
  kindCode: json['kindCode'] as String,
  kindLabel: json['kindLabel'] as String,
);

Map<String, dynamic> _$ExperienceContextLevelToJson(ExperienceContextLevel instance) => <String, dynamic>{
  'depth': instance.depth,
  'isRouting': instance.isRouting,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
};
