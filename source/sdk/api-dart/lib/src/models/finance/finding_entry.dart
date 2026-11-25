import 'package:json_annotation/json_annotation.dart';

part 'finding_entry.g.dart';

/// Finding Entry
@JsonSerializable(includeIfNull: false)
class FinanceFindingEntry {
  const FinanceFindingEntry({
    this.amount,
    required this.code,
    this.contractId,
    this.currencyCode,
    required this.findingId,
    required this.kindTerm,
    required this.periodId,
    this.projectId,
    required this.statusTerm,
  });
  final int? amount;
  final String code;
  final String? contractId;
  final String? currencyCode;
  final String findingId;
  final String kindTerm;
  final String periodId;
  final String? projectId;
  final String statusTerm;

  factory FinanceFindingEntry.fromJson(Map<String, dynamic> json) => _$FinanceFindingEntryFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFindingEntryToJson(this);
}
