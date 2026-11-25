// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorWindow _$StatisticsIndicatorWindowFromJson(Map<String, dynamic> json) => StatisticsIndicatorWindow(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  topicTerm: json['topicTerm'] as String?,
);

Map<String, dynamic> _$StatisticsIndicatorWindowToJson(StatisticsIndicatorWindow instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'topicTerm': ?instance.topicTerm,
};
