import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_activity.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_contacts.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_election.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_evidence.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_leader.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_media.dart';
import 'package:mzizi_api/src/models/insights/leader_profile_offices.dart';

part 'leader_profile.g.dart';

/// Leader Profile
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfile {
  const InsightsLeaderProfile({
    required this.activity,
    required this.contacts,
    required this.election,
    required this.evidence,
    required this.fund,
    required this.gaps,
    required this.leader,
    required this.media,
    required this.offices,
  });
  final InsightsLeaderProfileActivity activity;
  final List<InsightsLeaderProfileContacts> contacts;
  final List<InsightsLeaderProfileElection> election;
  final List<InsightsLeaderProfileEvidence> evidence;
  final Object? fund;
  final List<String> gaps;
  final InsightsLeaderProfileLeader leader;
  final List<InsightsLeaderProfileMedia> media;
  final List<InsightsLeaderProfileOffices> offices;

  factory InsightsLeaderProfile.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileToJson(this);
}
