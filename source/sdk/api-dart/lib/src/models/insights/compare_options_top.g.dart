// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options_top.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptionsTop _$InsightsCompareOptionsTopFromJson(Map<String, dynamic> json) => InsightsCompareOptionsTop(
  detail: json['detail'] as String,
  featureId: json['featureId'] as String,
  name: json['name'] as String,
  path: json['path'] as String,
  rank: (json['rank'] as num).toDouble(),
  share: (json['share'] as num).toDouble(),
  subjectId: json['subjectId'] as String?,
  value: (json['value'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsCompareOptionsTopToJson(InsightsCompareOptionsTop instance) => <String, dynamic>{
  'detail': instance.detail,
  'featureId': instance.featureId,
  'name': instance.name,
  'path': instance.path,
  'rank': instance.rank,
  'share': instance.share,
  'subjectId': ?instance.subjectId,
  'value': instance.value,
};
