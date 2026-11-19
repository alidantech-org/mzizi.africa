import 'package:json_annotation/json_annotation.dart';

part 'project_detail_procurement_bids.g.dart';

/// Project Detail Procurement Bids
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetailProcurementBids {
  const InsightsProjectDetailProcurementBids({required this.amount, required this.bidder, required this.outcome});
  final double amount;
  final String bidder;
  final String outcome;

  factory InsightsProjectDetailProcurementBids.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailProcurementBidsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailProcurementBidsToJson(this);
}
