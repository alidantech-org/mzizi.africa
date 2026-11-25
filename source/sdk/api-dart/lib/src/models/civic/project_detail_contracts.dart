import 'package:json_annotation/json_annotation.dart';

part 'project_detail_contracts.g.dart';

/// Project Detail Contracts
@JsonSerializable(includeIfNull: false)
class CivicProjectDetailContracts {
  const CivicProjectDetailContracts({
    this.amount,
    required this.code,
    required this.contractId,
    required this.contractorId,
    this.currencyCode,
    this.signedOn,
    required this.statusTerm,
  });
  final int? amount;
  final String code;
  final String contractId;
  final String contractorId;
  final String? currencyCode;
  final DateTime? signedOn;
  final String statusTerm;

  factory CivicProjectDetailContracts.fromJson(Map<String, dynamic> json) => _$CivicProjectDetailContractsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectDetailContractsToJson(this);
}
