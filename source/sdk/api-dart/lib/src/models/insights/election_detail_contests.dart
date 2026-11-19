import 'package:json_annotation/json_annotation.dart';

part 'election_detail_contests.g.dart';

/// Election Detail Contests
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetailContests {
  const InsightsElectionDetailContests({required this.contests, required this.kind});
  final double contests;
  final String kind;

  factory InsightsElectionDetailContests.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailContestsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailContestsToJson(this);
}
