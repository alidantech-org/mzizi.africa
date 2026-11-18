// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fact_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsFactList _$InsightsFactListFromJson(Map<String, dynamic> json) =>
    InsightsFactList(facts: json['facts'] as List<dynamic>, gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList());

Map<String, dynamic> _$InsightsFactListToJson(InsightsFactList instance) => <String, dynamic>{'facts': instance.facts, 'gaps': instance.gaps};
