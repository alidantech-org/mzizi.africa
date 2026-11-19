import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/election_detail_units_candidates.dart';
import 'package:mzizi_api/src/models/insights/election_detail_units_winner.dart';

part 'election_detail_units.g.dart';

/// Election Detail Units
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetailUnits {
  const InsightsElectionDetailUnits({
    required this.ballotsCast,
    required this.candidates,
    required this.featureId,
    this.geometry,
    required this.name,
    required this.path,
    required this.registered,
    required this.rejected,
    required this.turnout,
    required this.validVotes,
    required this.winner,
  });
  final double ballotsCast;
  final List<InsightsElectionDetailUnitsCandidates> candidates;
  final String featureId;
  final Object? geometry;
  final String name;
  final String path;
  final double registered;
  final double rejected;
  final double turnout;
  final double validVotes;
  final InsightsElectionDetailUnitsWinner winner;

  factory InsightsElectionDetailUnits.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailUnitsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailUnitsToJson(this);
}
