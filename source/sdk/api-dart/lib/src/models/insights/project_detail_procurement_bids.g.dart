// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail_procurement_bids.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsProjectDetailProcurementBids _$InsightsProjectDetailProcurementBidsFromJson(Map<String, dynamic> json) =>
    InsightsProjectDetailProcurementBids(
      amount: (json['amount'] as num).toDouble(),
      bidder: json['bidder'] as String,
      outcome: json['outcome'] as String,
    );

Map<String, dynamic> _$InsightsProjectDetailProcurementBidsToJson(InsightsProjectDetailProcurementBids instance) => <String, dynamic>{
  'amount': instance.amount,
  'bidder': instance.bidder,
  'outcome': instance.outcome,
};
