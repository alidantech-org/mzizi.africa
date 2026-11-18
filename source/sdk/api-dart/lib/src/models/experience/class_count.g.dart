// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'class_count.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceClassCount _$ExperienceClassCountFromJson(Map<String, dynamic> json) => ExperienceClassCount(
  code: json['code'] as String,
  count: (json['count'] as num).toInt(),
  label: json['label'] as String,
  parentCode: json['parentCode'] as String?,
);

Map<String, dynamic> _$ExperienceClassCountToJson(ExperienceClassCount instance) => <String, dynamic>{
  'code': instance.code,
  'count': instance.count,
  'label': instance.label,
  'parentCode': ?instance.parentCode,
};
