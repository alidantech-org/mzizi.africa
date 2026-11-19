// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail_procurement.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsProjectDetailProcurement _$InsightsProjectDetailProcurementFromJson(Map<String, dynamic> json) => InsightsProjectDetailProcurement(
  awardedOn: json['awarded_on'] as String?,
  bids: (json['bids'] as List<dynamic>).map((e) => InsightsProjectDetailProcurementBids.fromJson(e as Map<String, dynamic>)).toList(),
  buyer: json['buyer'] as String,
  closesOn: json['closes_on'] as String,
  code: json['code'] as String,
  contracts: (json['contracts'] as List<dynamic>)
      .map((e) => InsightsProjectDetailProcurementContracts.fromJson(e as Map<String, dynamic>))
      .toList(),
  procedure: json['procedure'] as String,
  publishedOn: json['published_on'] as String,
  reference: json['reference'] as String?,
  status: json['status'] as String,
  title: json['title'] as String?,
);

Map<String, dynamic> _$InsightsProjectDetailProcurementToJson(InsightsProjectDetailProcurement instance) => <String, dynamic>{
  'awarded_on': ?instance.awardedOn,
  'bids': instance.bids,
  'buyer': instance.buyer,
  'closes_on': instance.closesOn,
  'code': instance.code,
  'contracts': instance.contracts,
  'procedure': instance.procedure,
  'published_on': instance.publishedOn,
  'reference': ?instance.reference,
  'status': instance.status,
  'title': ?instance.title,
};
