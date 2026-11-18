import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/countdown_milestone.dart';
import 'package:mzizi_api/src/models/experience/recurrence_rule.dart';

part 'countdown.g.dart';

/// Countdown
@JsonSerializable(includeIfNull: false)
class ExperienceCountdown {
  const ExperienceCountdown({
    required this.daysAway,
    required this.eventCode,
    required this.knowledgeCode,
    required this.knowledgeLabel,
    required this.milestones,
    required this.name,
    required this.plannedOn,
    this.rule,
  });
  final int daysAway;
  final String eventCode;
  final String knowledgeCode;
  final String knowledgeLabel;
  final List<ExperienceCountdownMilestone> milestones;
  final String name;
  final DateTime plannedOn;
  final ExperienceRecurrenceRule? rule;

  factory ExperienceCountdown.fromJson(Map<String, dynamic> json) => _$ExperienceCountdownFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCountdownToJson(this);
}
