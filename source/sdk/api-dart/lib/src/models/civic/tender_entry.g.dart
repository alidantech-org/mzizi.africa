// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicTenderEntry _$CivicTenderEntryFromJson(Map<String, dynamic> json) => CivicTenderEntry(
  amount: (json['amount'] as num?)?.toInt(),
  buyerId: json['buyerId'] as String,
  categoryTerm: json['categoryTerm'] as String,
  closesOn: json['closesOn'] == null ? null : DateTime.parse(json['closesOn'] as String),
  code: json['code'] as String,
  currencyCode: json['currencyCode'] as String?,
  names: (json['names'] as List<dynamic>).map((e) => CivicTenderEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  procedureTerm: json['procedureTerm'] as String,
  procurementId: json['procurementId'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$CivicTenderEntryToJson(CivicTenderEntry instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'buyerId': instance.buyerId,
  'categoryTerm': instance.categoryTerm,
  'closesOn': ?instance.closesOn?.toIso8601String(),
  'code': instance.code,
  'currencyCode': ?instance.currencyCode,
  'names': instance.names,
  'procedureTerm': instance.procedureTerm,
  'procurementId': instance.procurementId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
};
