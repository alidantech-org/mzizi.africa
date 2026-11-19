import 'package:json_annotation/json_annotation.dart';

part 'motion_list_motions.g.dart';

/// Motion List Motions
@JsonSerializable(includeIfNull: false)
class InsightsMotionListMotions {
  const InsightsMotionListMotions({
    required this.absent,
    required this.abstain,
    required this.code,
    required this.heldOn,
    required this.institution,
    required this.institutionId,
    required this.kind,
    required this.no,
    required this.outcome,
    required this.summary,
    required this.title,
    required this.yes,
  });
  final double absent;
  final double abstain;
  final String code;

  @JsonKey(name: 'held_on')
  final String heldOn;
  final String institution;

  @JsonKey(name: 'institution_id')
  final String institutionId;
  final String kind;
  final double no;
  final String outcome;
  final String summary;
  final String title;
  final double yes;

  factory InsightsMotionListMotions.fromJson(Map<String, dynamic> json) => _$InsightsMotionListMotionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionListMotionsToJson(this);
}
