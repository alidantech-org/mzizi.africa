import 'package:json_annotation/json_annotation.dart';

part 'motion_detail_tally.g.dart';

/// Motion Detail Tally
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailTally {
  const InsightsMotionDetailTally({
    required this.absent,
    required this.abstain,
    required this.no,
    required this.passed,
    required this.total,
    required this.yes,
  });
  final double absent;
  final double abstain;
  final double no;
  final bool passed;
  final double total;
  final double yes;

  factory InsightsMotionDetailTally.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailTallyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailTallyToJson(this);
}
