// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'procurement_summary.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityProcurementSummary _$LocalityProcurementSummaryFromJson(Map<String, dynamic> json) => LocalityProcurementSummary(
  count: (json['count'] as num).toInt(),
  currency: json['currency'] as String?,
  recent: (json['recent'] as List<dynamic>).map((e) => LocalityProcurementItem.fromJson(e as Map<String, dynamic>)).toList(),
  totalAmount: (json['totalAmount'] as num?)?.toDouble(),
);

Map<String, dynamic> _$LocalityProcurementSummaryToJson(LocalityProcurementSummary instance) => <String, dynamic>{
  'count': instance.count,
  'currency': ?instance.currency,
  'recent': instance.recent,
  'totalAmount': ?instance.totalAmount,
};
