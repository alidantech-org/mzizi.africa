import 'package:json_annotation/json_annotation.dart';

part 'project_detail_procurement_contracts.g.dart';

/// Project Detail Procurement Contracts
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetailProcurementContracts {
  const InsightsProjectDetailProcurementContracts({
    required this.amount,
    required this.contractor,
    required this.signedOn,
    required this.status,
  });
  final double amount;
  final String contractor;

  @JsonKey(name: 'signed_on')
  final String signedOn;
  final String status;

  factory InsightsProjectDetailProcurementContracts.fromJson(Map<String, dynamic> json) =>
      _$InsightsProjectDetailProcurementContractsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailProcurementContractsToJson(this);
}
