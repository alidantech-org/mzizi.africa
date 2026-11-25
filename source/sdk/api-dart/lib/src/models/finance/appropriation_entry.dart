import 'package:json_annotation/json_annotation.dart';

part 'appropriation_entry.g.dart';

/// Appropriation Entry
@JsonSerializable(includeIfNull: false)
class FinanceAppropriationEntry {
  const FinanceAppropriationEntry({
    this.amount,
    required this.appropriationId,
    required this.classTerm,
    required this.code,
    this.currencyCode,
    this.featureId,
    this.parentId,
    this.projectId,
    this.recipientId,
  });
  final int? amount;
  final String appropriationId;
  final String classTerm;
  final String code;
  final String? currencyCode;
  final String? featureId;
  final String? parentId;
  final String? projectId;
  final String? recipientId;

  factory FinanceAppropriationEntry.fromJson(Map<String, dynamic> json) => _$FinanceAppropriationEntryFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceAppropriationEntryToJson(this);
}
