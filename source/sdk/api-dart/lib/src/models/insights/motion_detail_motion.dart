import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_motion_contributions.dart';

part 'motion_detail_motion.g.dart';

/// Motion Detail Motion
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailMotion {
  const InsightsMotionDetailMotion({
    required this.code,
    required this.contributions,
    required this.heldOn,
    required this.institution,
    required this.institutionId,
    required this.kind,
    required this.movedBy,
    required this.outcome,
    required this.sitting,
    required this.summary,
    required this.title,
  });
  final String code;
  final List<InsightsMotionDetailMotionContributions> contributions;

  @JsonKey(name: 'held_on')
  final String heldOn;
  final String institution;

  @JsonKey(name: 'institution_id')
  final String institutionId;
  final String kind;

  @JsonKey(name: 'moved_by')
  final String movedBy;
  final String outcome;
  final String sitting;
  final String summary;
  final String title;

  factory InsightsMotionDetailMotion.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailMotionFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailMotionToJson(this);
}
