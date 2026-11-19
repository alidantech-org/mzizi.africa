import 'package:json_annotation/json_annotation.dart';

part 'election_list_elections_winner.g.dart';

/// Election List Elections Winner
@JsonSerializable(includeIfNull: false)
class InsightsElectionListElectionsWinner {
  const InsightsElectionListElectionsWinner({required this.name, required this.party, required this.votes});
  final String name;
  final String party;
  final double votes;

  factory InsightsElectionListElectionsWinner.fromJson(Map<String, dynamic> json) => _$InsightsElectionListElectionsWinnerFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionListElectionsWinnerToJson(this);
}
