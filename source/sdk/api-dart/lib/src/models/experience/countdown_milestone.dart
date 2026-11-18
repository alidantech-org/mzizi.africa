import 'package:json_annotation/json_annotation.dart';

part 'countdown_milestone.g.dart';

/// Countdown Milestone
@JsonSerializable(includeIfNull: false)
class ExperienceCountdownMilestone {
  const ExperienceCountdownMilestone({required this.daysAway, required this.name, this.offsetDays, required this.plannedOn});
  final int daysAway;
  final String name;
  final int? offsetDays;
  final DateTime plannedOn;

  factory ExperienceCountdownMilestone.fromJson(Map<String, dynamic> json) => _$ExperienceCountdownMilestoneFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCountdownMilestoneToJson(this);
}
