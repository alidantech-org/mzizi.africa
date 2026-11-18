import 'package:json_annotation/json_annotation.dart';

part 'leader_profile.g.dart';

/// Leader Profile
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfile {
  const InsightsLeaderProfile({
    required this.activity,
    required this.contacts,
    required this.election,
    required this.evidence,
    this.fund,
    required this.gaps,
    required this.leader,
    required this.media,
    required this.offices,
  });
  final Object? activity;
  final List<Object?> contacts;
  final List<Object?> election;
  final List<Object?> evidence;
  final Object? fund;
  final List<String> gaps;
  final Object? leader;
  final List<Object?> media;
  final List<Object?> offices;

  factory InsightsLeaderProfile.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileToJson(this);
}
