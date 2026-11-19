import 'package:json_annotation/json_annotation.dart';

part 'election_detail_totals.g.dart';

/// Election Detail Totals
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetailTotals {
  const InsightsElectionDetailTotals({
    required this.name,
    required this.party,
    required this.partyCode,
    required this.share,
    required this.votes,
  });
  final String name;
  final String party;
  final String partyCode;
  final double share;
  final double votes;

  factory InsightsElectionDetailTotals.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailTotalsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailTotalsToJson(this);
}
