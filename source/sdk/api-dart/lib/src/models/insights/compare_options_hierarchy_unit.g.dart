// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options_hierarchy_unit.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptionsHierarchyUnit _$InsightsCompareOptionsHierarchyUnitFromJson(Map<String, dynamic> json) =>
    InsightsCompareOptionsHierarchyUnit(
      featureId: json['featureId'] as String,
      kindCode: json['kindCode'] as String,
      kindLabel: json['kindLabel'] as String,
      name: json['name'] as String,
      path: json['path'] as String?,
    );

Map<String, dynamic> _$InsightsCompareOptionsHierarchyUnitToJson(InsightsCompareOptionsHierarchyUnit instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
  'path': ?instance.path,
};
