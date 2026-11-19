import 'package:json_annotation/json_annotation.dart';

part 'election_detail_units_winner.g.dart';

/// Election Detail Units Winner
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetailUnitsWinner {
  const InsightsElectionDetailUnitsWinner({
    required this.margin,
    required this.name,
    required this.party,
    required this.partyCode,
    required this.share,
    required this.votes,
  });
  final double margin;
  final String name;
  final String party;
  final String partyCode;
  final double share;
  final double votes;

  factory InsightsElectionDetailUnitsWinner.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailUnitsWinnerFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailUnitsWinnerToJson(this);
}
