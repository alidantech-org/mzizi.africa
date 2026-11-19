import 'package:json_annotation/json_annotation.dart';

part 'election_detail_election.g.dart';

/// Election Detail Election
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetailElection {
  const InsightsElectionDetailElection({
    required this.code,
    this.contestKind,
    required this.electionId,
    required this.heldOn,
    required this.year,
  });
  final String code;
  final String? contestKind;
  final String electionId;
  final String heldOn;
  final double year;

  factory InsightsElectionDetailElection.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailElectionFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailElectionToJson(this);
}
