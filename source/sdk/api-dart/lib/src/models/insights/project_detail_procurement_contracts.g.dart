// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail_procurement_contracts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsProjectDetailProcurementContracts _$InsightsProjectDetailProcurementContractsFromJson(Map<String, dynamic> json) =>
    InsightsProjectDetailProcurementContracts(
      amount: (json['amount'] as num).toDouble(),
      contractor: json['contractor'] as String,
      signedOn: json['signed_on'] as String,
      status: json['status'] as String,
    );

Map<String, dynamic> _$InsightsProjectDetailProcurementContractsToJson(InsightsProjectDetailProcurementContracts instance) => <String, dynamic>{
  'amount': instance.amount,
  'contractor': instance.contractor,
  'signed_on': instance.signedOn,
  'status': instance.status,
};
