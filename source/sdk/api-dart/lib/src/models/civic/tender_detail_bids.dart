import 'package:json_annotation/json_annotation.dart';

part 'tender_detail_bids.g.dart';

/// Tender Detail Bids
@JsonSerializable(includeIfNull: false)
class CivicTenderDetailBids {
  const CivicTenderDetailBids({this.amount, required this.bidderId, required this.outcomeTerm, this.submittedOn});
  final int? amount;
  final String bidderId;
  final String outcomeTerm;
  final DateTime? submittedOn;

  factory CivicTenderDetailBids.fromJson(Map<String, dynamic> json) => _$CivicTenderDetailBidsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderDetailBidsToJson(this);
}
