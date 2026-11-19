// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic_fund.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivicFund _$InsightsPlaceCivicFundFromJson(Map<String, dynamic> json) =>
    InsightsPlaceCivicFund(code: json['code'] as String, funds: (json['funds'] as num).toDouble(), managedBy: json['managedBy'] as String);

Map<String, dynamic> _$InsightsPlaceCivicFundToJson(InsightsPlaceCivicFund instance) => <String, dynamic>{
  'code': instance.code,
  'funds': instance.funds,
  'managedBy': instance.managedBy,
};
