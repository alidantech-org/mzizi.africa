import 'package:json_annotation/json_annotation.dart';

part 'tender_list_tenders.g.dart';

/// Tender List Tenders
@JsonSerializable(includeIfNull: false)
class InsightsTenderListTenders {
  const InsightsTenderListTenders({
    this.amount,
    this.awardedOn,
    required this.bids,
    required this.buyer,
    required this.closesOn,
    required this.code,
    required this.disclosed,
    required this.disclosedOf,
    this.place,
    required this.procedure,
    required this.publishedOn,
    this.reference,
    required this.status,
    this.supplier,
    required this.title,
  });
  final double? amount;

  @JsonKey(name: 'awarded_on')
  final String? awardedOn;
  final double bids;
  final String buyer;

  @JsonKey(name: 'closes_on')
  final String closesOn;
  final String code;
  final double disclosed;
  final double disclosedOf;
  final String? place;
  final String procedure;

  @JsonKey(name: 'published_on')
  final String publishedOn;
  final String? reference;
  final String status;
  final String? supplier;
  final String title;

  factory InsightsTenderListTenders.fromJson(Map<String, dynamic> json) => _$InsightsTenderListTendersFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsTenderListTendersToJson(this);
}
