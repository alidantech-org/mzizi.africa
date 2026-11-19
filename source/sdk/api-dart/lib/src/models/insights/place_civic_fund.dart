import 'package:json_annotation/json_annotation.dart';

part 'place_civic_fund.g.dart';

/// Place Civic Fund
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicFund {
  const InsightsPlaceCivicFund({required this.code, required this.funds, required this.managedBy});
  final String code;
  final double funds;
  final String managedBy;

  factory InsightsPlaceCivicFund.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicFundFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicFundToJson(this);
}
