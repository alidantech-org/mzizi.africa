import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/ledger/fund.dart';

part 'fund_list.g.dart';

/// Fund List
@JsonSerializable(includeIfNull: false)
class LedgerFundList {
  const LedgerFundList({required this.funds, required this.gaps, required this.total});
  final List<LedgerFund> funds;
  final List<String> gaps;
  final int total;

  factory LedgerFundList.fromJson(Map<String, dynamic> json) => _$LedgerFundListFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerFundListToJson(this);
}
