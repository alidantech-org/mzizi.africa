import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/procurement_item.dart';

part 'procurement_summary.g.dart';

/// Procurement Summary
@JsonSerializable(includeIfNull: false)
class LocalityProcurementSummary {
  const LocalityProcurementSummary({required this.count, this.currency, required this.recent, this.totalAmount});
  final int count;
  final String? currency;
  final List<LocalityProcurementItem> recent;
  final double? totalAmount;

  factory LocalityProcurementSummary.fromJson(Map<String, dynamic> json) => _$LocalityProcurementSummaryFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityProcurementSummaryToJson(this);
}
