import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/ledger/coverage_item.dart';

part 'coverage_list.g.dart';

/// Coverage List
@JsonSerializable(includeIfNull: false)
class LedgerCoverageList {
  const LedgerCoverageList({required this.gaps, required this.items});
  final List<String> gaps;
  final List<LedgerCoverageItem> items;

  factory LedgerCoverageList.fromJson(Map<String, dynamic> json) => _$LedgerCoverageListFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerCoverageListToJson(this);
}
