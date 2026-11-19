import 'package:json_annotation/json_annotation.dart';

part 'party_detail_members.g.dart';

/// Party Detail Members
@JsonSerializable(includeIfNull: false)
class InsightsPartyDetailMembers {
  const InsightsPartyDetailMembers({
    this.holderId,
    required this.individualId,
    this.leaderSlug,
    required this.name,
    this.office,
    this.unit,
    this.unitId,
    this.unitPath,
  });
  final String? holderId;
  final String individualId;
  final String? leaderSlug;
  final String name;
  final String? office;
  final String? unit;
  final String? unitId;
  final String? unitPath;

  factory InsightsPartyDetailMembers.fromJson(Map<String, dynamic> json) => _$InsightsPartyDetailMembersFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyDetailMembersToJson(this);
}
