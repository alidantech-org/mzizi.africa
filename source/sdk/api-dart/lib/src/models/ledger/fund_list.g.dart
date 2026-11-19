// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fund_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerFundList _$LedgerFundListFromJson(Map<String, dynamic> json) => LedgerFundList(
  funds: (json['funds'] as List<dynamic>).map((e) => LedgerFund.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$LedgerFundListToJson(LedgerFundList instance) => <String, dynamic>{
  'funds': instance.funds,
  'gaps': instance.gaps,
  'total': instance.total,
};
