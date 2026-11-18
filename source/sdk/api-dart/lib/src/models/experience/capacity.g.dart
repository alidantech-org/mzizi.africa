// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'capacity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCapacity _$ExperienceCapacityFromJson(Map<String, dynamic> json) =>
    ExperienceCapacity(indicatorCode: json['indicatorCode'] as String, label: json['label'] as String, value: (json['value'] as num).toDouble());

Map<String, dynamic> _$ExperienceCapacityToJson(ExperienceCapacity instance) => <String, dynamic>{
  'indicatorCode': instance.indicatorCode,
  'label': instance.label,
  'value': instance.value,
};
