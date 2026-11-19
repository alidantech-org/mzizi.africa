import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_activity_recent.g.dart';

/// Leader Profile Activity Recent
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileActivityRecent {
  const InsightsLeaderProfileActivityRecent({
    required this.code,
    required this.heldOn,
    required this.outcome,
    required this.position,
    required this.title,
  });
  final String code;

  @JsonKey(name: 'held_on')
  final String heldOn;
  final String outcome;
  final String position;
  final String title;

  factory InsightsLeaderProfileActivityRecent.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileActivityRecentFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileActivityRecentToJson(this);
}
