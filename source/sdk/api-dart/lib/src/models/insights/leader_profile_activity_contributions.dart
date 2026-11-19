import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_activity_contributions.g.dart';

/// Leader Profile Activity Contributions
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileActivityContributions {
  const InsightsLeaderProfileActivityContributions({required this.count, required this.words});
  final double count;
  final double words;

  factory InsightsLeaderProfileActivityContributions.fromJson(Map<String, dynamic> json) =>
      _$InsightsLeaderProfileActivityContributionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileActivityContributionsToJson(this);
}
