import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/tender_list_summary_by_status.dart';
import 'package:mzizi_api/src/models/insights/tender_list_summary_transparency.dart';

part 'tender_list_summary.g.dart';

/// Tender List Summary
@JsonSerializable(includeIfNull: false)
class InsightsTenderListSummary {
  const InsightsTenderListSummary({required this.byStatus, required this.total, required this.transparency});
  final List<InsightsTenderListSummaryByStatus> byStatus;
  final double total;
  final InsightsTenderListSummaryTransparency transparency;

  factory InsightsTenderListSummary.fromJson(Map<String, dynamic> json) => _$InsightsTenderListSummaryFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderListSummaryToJson(this);
}
