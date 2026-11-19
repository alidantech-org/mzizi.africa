// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_list_summary.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTenderListSummary _$InsightsTenderListSummaryFromJson(Map<String, dynamic> json) => InsightsTenderListSummary(
  byStatus: (json['byStatus'] as List<dynamic>).map((e) => InsightsTenderListSummaryByStatus.fromJson(e as Map<String, dynamic>)).toList(),
  total: (json['total'] as num).toDouble(),
  transparency: InsightsTenderListSummaryTransparency.fromJson(json['transparency'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsTenderListSummaryToJson(InsightsTenderListSummary instance) => <String, dynamic>{
  'byStatus': instance.byStatus,
  'total': instance.total,
  'transparency': instance.transparency,
};
