// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options_hierarchy.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptionsHierarchy _$InsightsCompareOptionsHierarchyFromJson(Map<String, dynamic> json) => InsightsCompareOptionsHierarchy(
  available: json['available'] as bool,
  label: json['label'] as String,
  message: json['message'] as String?,
  rung: json['rung'] as String,
  unit: json['unit'] == null ? null : InsightsCompareOptionsHierarchyUnit.fromJson(json['unit'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsCompareOptionsHierarchyToJson(InsightsCompareOptionsHierarchy instance) => <String, dynamic>{
  'available': instance.available,
  'label': instance.label,
  'message': ?instance.message,
  'rung': instance.rung,
  'unit': ?instance.unit,
};
