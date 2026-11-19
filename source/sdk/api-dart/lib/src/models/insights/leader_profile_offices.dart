import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_offices.g.dart';

/// Leader Profile Offices
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileOffices {
  const InsightsLeaderProfileOffices({
    required this.holderId,
    required this.leaderSlug,
    this.leftOfficeOn,
    required this.office,
    required this.tookOfficeOn,
    this.unit,
  });
  final String holderId;
  final String leaderSlug;
  final String? leftOfficeOn;
  final String office;
  final String tookOfficeOn;
  final String? unit;

  factory InsightsLeaderProfileOffices.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileOfficesToJson(this);
}
