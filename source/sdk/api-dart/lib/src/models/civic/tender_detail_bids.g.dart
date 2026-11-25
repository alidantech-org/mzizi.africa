// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_detail_bids.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicTenderDetailBids _$CivicTenderDetailBidsFromJson(Map<String, dynamic> json) => CivicTenderDetailBids(
  amount: (json['amount'] as num?)?.toInt(),
  bidderId: json['bidderId'] as String,
  outcomeTerm: json['outcomeTerm'] as String,
  submittedOn: json['submittedOn'] == null ? null : DateTime.parse(json['submittedOn'] as String),
);

Map<String, dynamic> _$CivicTenderDetailBidsToJson(CivicTenderDetailBids instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'bidderId': instance.bidderId,
  'outcomeTerm': instance.outcomeTerm,
  'submittedOn': ?instance.submittedOn?.toIso8601String(),
};
