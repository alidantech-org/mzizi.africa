import 'package:json_annotation/json_annotation.dart';

part 'tender_list_summary_by_status.g.dart';

/// Tender List Summary By Status
@JsonSerializable(includeIfNull: false)
class InsightsTenderListSummaryByStatus {
  const InsightsTenderListSummaryByStatus({required this.count, required this.status, required this.valueKes});
  final double count;
  final String status;
  final double valueKes;

  factory InsightsTenderListSummaryByStatus.fromJson(Map<String, dynamic> json) => _$InsightsTenderListSummaryByStatusFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderListSummaryByStatusToJson(this);
}
