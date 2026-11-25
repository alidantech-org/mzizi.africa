import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/tender_detail_bids.dart';
import 'package:mzizi_api/src/models/civic/tender_detail_names.dart';

part 'tender_detail.g.dart';

/// Tender Detail
@JsonSerializable(includeIfNull: false)
class CivicTenderDetail {
  const CivicTenderDetail({
    this.amount,
    this.bidderCount,
    required this.bids,
    required this.buyerId,
    required this.categoryTerm,
    required this.code,
    this.currencyCode,
    required this.names,
    required this.procedureTerm,
    required this.procurementId,
    this.projectId,
    required this.statusTerm,
  });
  final int? amount;
  final int? bidderCount;
  final List<CivicTenderDetailBids> bids;
  final String buyerId;
  final String categoryTerm;
  final String code;
  final String? currencyCode;
  final List<CivicTenderDetailNames> names;
  final String procedureTerm;
  final String procurementId;
  final String? projectId;
  final String statusTerm;

  factory CivicTenderDetail.fromJson(Map<String, dynamic> json) => _$CivicTenderDetailFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderDetailToJson(this);
}
