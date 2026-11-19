import 'package:json_annotation/json_annotation.dart';

part 'motion_detail_motion_contributions.g.dart';

/// Motion Detail Motion Contributions
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailMotionContributions {
  const InsightsMotionDetailMotionContributions({
    required this.holderId,
    required this.kind,
    required this.name,
    this.party,
    required this.summary,
    required this.wordCount,
  });

  @JsonKey(name: 'holder_id')
  final String holderId;
  final String kind;
  final String name;
  final String? party;
  final String summary;

  @JsonKey(name: 'word_count')
  final double wordCount;

  factory InsightsMotionDetailMotionContributions.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailMotionContributionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailMotionContributionsToJson(this);
}
