import 'package:json_annotation/json_annotation.dart';

part 'tender_list_summary_transparency.g.dart';

/// Tender List Summary Transparency
@JsonSerializable(includeIfNull: false)
class InsightsTenderListSummaryTransparency {
  const InsightsTenderListSummaryTransparency({required this.listed, required this.withContract});
  final double listed;
  final double withContract;

  factory InsightsTenderListSummaryTransparency.fromJson(Map<String, dynamic> json) => _$InsightsTenderListSummaryTransparencyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderListSummaryTransparencyToJson(this);
}
