import 'package:json_annotation/json_annotation.dart';

part 'party_detail_funding.g.dart';

/// Party Detail Funding
@JsonSerializable(includeIfNull: false)
class InsightsPartyDetailFunding {
  const InsightsPartyDetailFunding({required this.amountKes, required this.year});
  final double amountKes;
  final double year;

  factory InsightsPartyDetailFunding.fromJson(Map<String, dynamic> json) => _$InsightsPartyDetailFundingFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyDetailFundingToJson(this);
}
