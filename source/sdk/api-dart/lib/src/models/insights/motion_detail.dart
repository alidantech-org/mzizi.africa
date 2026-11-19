import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_legal.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_members.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_motion.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_parties.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_tally.dart';

part 'motion_detail.g.dart';

/// Motion Detail
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetail {
  const InsightsMotionDetail({
    required this.gaps,
    required this.legal,
    required this.members,
    required this.motion,
    required this.parties,
    required this.tally,
  });
  final List<String> gaps;
  final InsightsMotionDetailLegal legal;
  final List<InsightsMotionDetailMembers> members;
  final InsightsMotionDetailMotion motion;
  final List<InsightsMotionDetailParties> parties;
  final InsightsMotionDetailTally tally;

  factory InsightsMotionDetail.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailToJson(this);
}
