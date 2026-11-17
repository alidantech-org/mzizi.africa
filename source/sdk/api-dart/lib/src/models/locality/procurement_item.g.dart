// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'procurement_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityProcurementItem _$LocalityProcurementItemFromJson(Map<String, dynamic> json) => LocalityProcurementItem(
  amount: (json['amount'] as num?)?.toDouble(),
  awardedTo: json['awardedTo'] as String?,
  currency: json['currency'] as String?,
  evidence: (json['evidence'] as List<dynamic>).map((e) => LocalityEvidenceRef.fromJson(e as Map<String, dynamic>)).toList(),
  procurementId: json['procurementId'] as String,
  status: json['status'] as String?,
  title: json['title'] as String,
  year: (json['year'] as num?)?.toInt(),
);

Map<String, dynamic> _$LocalityProcurementItemToJson(LocalityProcurementItem instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'awardedTo': ?instance.awardedTo,
  'currency': ?instance.currency,
  'evidence': instance.evidence,
  'procurementId': instance.procurementId,
  'status': ?instance.status,
  'title': instance.title,
  'year': ?instance.year,
};
