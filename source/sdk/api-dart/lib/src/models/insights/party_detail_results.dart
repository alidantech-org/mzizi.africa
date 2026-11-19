import 'package:json_annotation/json_annotation.dart';

part 'party_detail_results.g.dart';

/// Party Detail Results
@JsonSerializable(includeIfNull: false)
class InsightsPartyDetailResults {
  const InsightsPartyDetailResults({
    required this.candidates,
    required this.contest,
    required this.votes,
    required this.won,
    required this.year,
  });
  final double candidates;
  final String contest;
  final double votes;
  final double won;
  final double year;

  factory InsightsPartyDetailResults.fromJson(Map<String, dynamic> json) => _$InsightsPartyDetailResultsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyDetailResultsToJson(this);
}
