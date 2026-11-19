// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_list_tenders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTenderListTenders _$InsightsTenderListTendersFromJson(Map<String, dynamic> json) => InsightsTenderListTenders(
  amount: (json['amount'] as num?)?.toDouble(),
  awardedOn: json['awarded_on'] as String?,
  bids: (json['bids'] as num).toDouble(),
  buyer: json['buyer'] as String,
  closesOn: json['closes_on'] as String,
  code: json['code'] as String,
  disclosed: (json['disclosed'] as num).toDouble(),
  disclosedOf: (json['disclosedOf'] as num).toDouble(),
  place: json['place'] as String?,
  procedure: json['procedure'] as String,
  publishedOn: json['published_on'] as String,
  reference: json['reference'] as String?,
  status: json['status'] as String,
  supplier: json['supplier'] as String?,
  title: json['title'] as String,
);

Map<String, dynamic> _$InsightsTenderListTendersToJson(InsightsTenderListTenders instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'awarded_on': ?instance.awardedOn,
  'bids': instance.bids,
  'buyer': instance.buyer,
  'closes_on': instance.closesOn,
  'code': instance.code,
  'disclosed': instance.disclosed,
  'disclosedOf': instance.disclosedOf,
  'place': ?instance.place,
  'procedure': instance.procedure,
  'published_on': instance.publishedOn,
  'reference': ?instance.reference,
  'status': instance.status,
  'supplier': ?instance.supplier,
  'title': instance.title,
};
