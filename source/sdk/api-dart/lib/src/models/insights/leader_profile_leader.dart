import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_leader.g.dart';

/// Leader Profile Leader
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileLeader {
  const InsightsLeaderProfileLeader({
    required this.birthDate,
    required this.holderId,
    required this.individualId,
    required this.institution,
    required this.leaderSlug,
    required this.name,
    required this.office,
    this.party,
    required this.tookOfficeOn,
    this.unit,
    this.unitId,
    this.unitPath,
  });
  final String birthDate;
  final String holderId;
  final String individualId;
  final String institution;
  final String leaderSlug;
  final String name;
  final String office;
  final String? party;
  final String tookOfficeOn;
  final String? unit;
  final String? unitId;
  final String? unitPath;

  factory InsightsLeaderProfileLeader.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileLeaderFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileLeaderToJson(this);
}
