import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/tender_entry_names.dart';

part 'tender_entry.g.dart';

/// Tender Entry
@JsonSerializable(includeIfNull: false)
class CivicTenderEntry {
  const CivicTenderEntry({
    this.amount,
    required this.buyerId,
    required this.categoryTerm,
    this.closesOn,
    required this.code,
    this.currencyCode,
    required this.names,
    required this.procedureTerm,
    required this.procurementId,
    this.publishedOn,
    required this.statusTerm,
  });
  final int? amount;
  final String buyerId;
  final String categoryTerm;
  final DateTime? closesOn;
  final String code;
  final String? currencyCode;
  final List<CivicTenderEntryNames> names;
  final String procedureTerm;
  final String procurementId;
  final DateTime? publishedOn;
  final String statusTerm;

  factory CivicTenderEntry.fromJson(Map<String, dynamic> json) => _$CivicTenderEntryFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderEntryToJson(this);
}
