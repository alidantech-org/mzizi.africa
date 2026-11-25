// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bill_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureBillEntry _$LegislatureBillEntryFromJson(Map<String, dynamic> json) => LegislatureBillEntry(
  billId: json['billId'] as String,
  code: json['code'] as String,
  instrumentId: json['instrumentId'] as String?,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => LegislatureBillEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  statusTerm: json['statusTerm'] as String,
  termId: json['termId'] as String?,
);

Map<String, dynamic> _$LegislatureBillEntryToJson(LegislatureBillEntry instance) => <String, dynamic>{
  'billId': instance.billId,
  'code': instance.code,
  'instrumentId': ?instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'statusTerm': instance.statusTerm,
  'termId': ?instance.termId,
};
