import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_activity_contributions.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_activity_recent.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_activity_speeches.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_activity_votes.dart';

part 'leader_profile_activity.g.dart';

/// Leader Profile Activity
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileActivity {
  const InsightsLeaderProfileActivity({
    required this.contributions,
    required this.recent,
    required this.recorded,
    required this.speeches,
    required this.votes,
  });
  final InsightsLeaderProfileActivityContributions contributions;
  final List<InsightsLeaderProfileActivityRecent> recent;
  final bool recorded;
  final List<InsightsLeaderProfileActivitySpeeches> speeches;
  final InsightsLeaderProfileActivityVotes votes;

  factory InsightsLeaderProfileActivity.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileActivityFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileActivityToJson(this);
}
