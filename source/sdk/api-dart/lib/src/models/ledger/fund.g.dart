// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fund.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerFund _$LedgerFundFromJson(Map<String, dynamic> json) => LedgerFund(
  code: json['code'] as String,
  featureId: json['featureId'] as String?,
  flows: (json['flows'] as num).toInt(),
  kind: json['kind'] as String,
  manager: json['manager'] as String?,
  path: json['path'] as String?,
  place: json['place'] as String?,
  source: json['source'] as String?,
);

Map<String, dynamic> _$LedgerFundToJson(LedgerFund instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': ?instance.featureId,
  'flows': instance.flows,
  'kind': instance.kind,
  'manager': ?instance.manager,
  'path': ?instance.path,
  'place': ?instance.place,
  'source': ?instance.source,
};
