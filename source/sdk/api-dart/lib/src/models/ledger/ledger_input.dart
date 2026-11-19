import 'package:json_annotation/json_annotation.dart';

part 'ledger_input.g.dart';

/// Ledger Input
@JsonSerializable(includeIfNull: false)
class LedgerLedgerInput {
  const LedgerLedgerInput({this.limit});
  final int? limit;

  factory LedgerLedgerInput.fromJson(Map<String, dynamic> json) => _$LedgerLedgerInputFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerLedgerInputToJson(this);
}
