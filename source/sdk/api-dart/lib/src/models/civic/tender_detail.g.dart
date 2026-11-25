// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicTenderDetail _$CivicTenderDetailFromJson(Map<String, dynamic> json) => CivicTenderDetail(
  amount: (json['amount'] as num?)?.toInt(),
  bidderCount: (json['bidderCount'] as num?)?.toInt(),
  bids: (json['bids'] as List<dynamic>).map((e) => CivicTenderDetailBids.fromJson(e as Map<String, dynamic>)).toList(),
  buyerId: json['buyerId'] as String,
  categoryTerm: json['categoryTerm'] as String,
  code: json['code'] as String,
  currencyCode: json['currencyCode'] as String?,
  names: (json['names'] as List<dynamic>).map((e) => CivicTenderDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  procedureTerm: json['procedureTerm'] as String,
  procurementId: json['procurementId'] as String,
  projectId: json['projectId'] as String?,
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$CivicTenderDetailToJson(CivicTenderDetail instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'bidderCount': ?instance.bidderCount,
  'bids': instance.bids,
  'buyerId': instance.buyerId,
  'categoryTerm': instance.categoryTerm,
  'code': instance.code,
  'currencyCode': ?instance.currencyCode,
  'names': instance.names,
  'procedureTerm': instance.procedureTerm,
  'procurementId': instance.procurementId,
  'projectId': ?instance.projectId,
  'statusTerm': instance.statusTerm,
};
