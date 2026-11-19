import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_activity_speeches.g.dart';

/// Leader Profile Activity Speeches
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileActivitySpeeches {
  const InsightsLeaderProfileActivitySpeeches({
    required this.heldOn,
    required this.kind,
    required this.motion,
    required this.motionCode,
    required this.summary,
    required this.wordCount,
  });

  @JsonKey(name: 'held_on')
  final String heldOn;
  final String kind;
  final String motion;

  @JsonKey(name: 'motion_code')
  final String motionCode;
  final String summary;

  @JsonKey(name: 'word_count')
  final double wordCount;

  factory InsightsLeaderProfileActivitySpeeches.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileActivitySpeechesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileActivitySpeechesToJson(this);
}
