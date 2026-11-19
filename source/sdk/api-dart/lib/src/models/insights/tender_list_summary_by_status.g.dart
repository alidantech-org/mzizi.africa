// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_list_summary_by_status.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTenderListSummaryByStatus _$InsightsTenderListSummaryByStatusFromJson(Map<String, dynamic> json) => InsightsTenderListSummaryByStatus(
  count: (json['count'] as num).toDouble(),
  status: json['status'] as String,
  valueKes: (json['valueKes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsTenderListSummaryByStatusToJson(InsightsTenderListSummaryByStatus instance) => <String, dynamic>{
  'count': instance.count,
  'status': instance.status,
  'valueKes': instance.valueKes,
};
