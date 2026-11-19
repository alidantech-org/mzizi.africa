import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/ledger/coalition.dart';

part 'coalition_list.g.dart';

/// Coalition List
@JsonSerializable(includeIfNull: false)
class LedgerCoalitionList {
  const LedgerCoalitionList({required this.coalitions, required this.gaps});
  final List<LedgerCoalition> coalitions;
  final List<String> gaps;

  factory LedgerCoalitionList.fromJson(Map<String, dynamic> json) => _$LedgerCoalitionListFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerCoalitionListToJson(this);
}
