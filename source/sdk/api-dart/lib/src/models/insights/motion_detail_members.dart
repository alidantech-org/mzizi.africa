import 'package:json_annotation/json_annotation.dart';

part 'motion_detail_members.g.dart';

/// Motion Detail Members
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailMembers {
  const InsightsMotionDetailMembers({
    required this.holderId,
    required this.individualId,
    required this.leaderSlug,
    required this.name,
    required this.office,
    this.party,
    this.partyCode,
    required this.position,
    this.unit,
  });
  final String holderId;
  final String individualId;
  final String leaderSlug;
  final String name;
  final String office;
  final String? party;
  final String? partyCode;
  final String position;
  final String? unit;

  factory InsightsMotionDetailMembers.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailMembersFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailMembersToJson(this);
}
