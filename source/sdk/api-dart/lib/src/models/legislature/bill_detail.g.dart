// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bill_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureBillDetail _$LegislatureBillDetailFromJson(Map<String, dynamic> json) => LegislatureBillDetail(
  billId: json['billId'] as String,
  code: json['code'] as String,
  institutionId: json['institutionId'] as String,
  instrumentId: json['instrumentId'] as String?,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => LegislatureBillDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  sponsorId: json['sponsorId'] as String?,
  stages: (json['stages'] as List<dynamic>).map((e) => LegislatureBillDetailStages.fromJson(e as Map<String, dynamic>)).toList(),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$LegislatureBillDetailToJson(LegislatureBillDetail instance) => <String, dynamic>{
  'billId': instance.billId,
  'code': instance.code,
  'institutionId': instance.institutionId,
  'instrumentId': ?instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'sponsorId': ?instance.sponsorId,
  'stages': instance.stages,
  'statusTerm': instance.statusTerm,
};
