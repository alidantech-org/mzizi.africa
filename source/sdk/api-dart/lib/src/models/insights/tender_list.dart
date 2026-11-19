import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/tender_list_summary.dart';
import 'package:mzizi_api/src/models/insights/tender_list_tenders.dart';

part 'tender_list.g.dart';

/// Tender List
@JsonSerializable(includeIfNull: false)
class InsightsTenderList {
  const InsightsTenderList({required this.gaps, required this.summary, required this.tenders});
  final List<String> gaps;
  final InsightsTenderListSummary summary;
  final List<InsightsTenderListTenders> tenders;

  factory InsightsTenderList.fromJson(Map<String, dynamic> json) => _$InsightsTenderListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderListToJson(this);
}
