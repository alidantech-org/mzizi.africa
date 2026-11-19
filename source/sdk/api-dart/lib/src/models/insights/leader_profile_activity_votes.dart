import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_activity_votes.g.dart';

/// Leader Profile Activity Votes
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileActivityVotes {
  const InsightsLeaderProfileActivityVotes({
    required this.absent,
    required this.abstain,
    this.attendance,
    required this.no,
    required this.total,
    required this.yes,
  });
  final double absent;
  final double abstain;
  final double? attendance;
  final double no;
  final double total;
  final double yes;

  factory InsightsLeaderProfileActivityVotes.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileActivityVotesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileActivityVotesToJson(this);
}
