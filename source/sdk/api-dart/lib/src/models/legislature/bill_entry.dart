import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/bill_entry_names.dart';

part 'bill_entry.g.dart';

/// Bill Entry
@JsonSerializable(includeIfNull: false)
class LegislatureBillEntry {
  const LegislatureBillEntry({
    required this.billId,
    required this.code,
    this.instrumentId,
    required this.kindTerm,
    required this.names,
    required this.statusTerm,
    this.termId,
  });
  final String billId;
  final String code;
  final String? instrumentId;
  final String kindTerm;
  final List<LegislatureBillEntryNames> names;
  final String statusTerm;
  final String? termId;

  factory LegislatureBillEntry.fromJson(Map<String, dynamic> json) => _$LegislatureBillEntryFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillEntryToJson(this);
}
