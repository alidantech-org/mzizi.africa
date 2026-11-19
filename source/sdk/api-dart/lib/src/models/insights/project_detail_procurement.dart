import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/project_detail_procurement_bids.dart';
import 'package:mzizi_api/src/models/insights/project_detail_procurement_contracts.dart';

part 'project_detail_procurement.g.dart';

/// Project Detail Procurement
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetailProcurement {
  const InsightsProjectDetailProcurement({
    this.awardedOn,
    required this.bids,
    required this.buyer,
    required this.closesOn,
    required this.code,
    required this.contracts,
    required this.procedure,
    required this.publishedOn,
    this.reference,
    required this.status,
    this.title,
  });

  @JsonKey(name: 'awarded_on')
  final String? awardedOn;
  final List<InsightsProjectDetailProcurementBids> bids;
  final String buyer;

  @JsonKey(name: 'closes_on')
  final String closesOn;
  final String code;
  final List<InsightsProjectDetailProcurementContracts> contracts;
  final String procedure;

  @JsonKey(name: 'published_on')
  final String publishedOn;
  final String? reference;
  final String status;
  final String? title;

  factory InsightsProjectDetailProcurement.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailProcurementFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailProcurementToJson(this);
}
