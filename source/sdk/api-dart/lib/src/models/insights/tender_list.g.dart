// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTenderList _$InsightsTenderListFromJson(Map<String, dynamic> json) => InsightsTenderList(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  summary: InsightsTenderListSummary.fromJson(json['summary'] as Map<String, dynamic>),
  tenders: (json['tenders'] as List<dynamic>).map((e) => InsightsTenderListTenders.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsTenderListToJson(InsightsTenderList instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'summary': instance.summary,
  'tenders': instance.tenders,
};
