import 'package:json_annotation/json_annotation.dart';

part 'motion_detail.g.dart';

/// Motion Detail
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetail {
  const InsightsMotionDetail({
    required this.gaps,
    this.legal,
    required this.members,
    required this.motion,
    required this.parties,
    required this.tally,
  });
  final List<String> gaps;
  final Object? legal;
  final List<Object?> members;
  final Object? motion;
  final List<Object?> parties;
  final Object? tally;

  factory InsightsMotionDetail.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailToJson(this);
}
