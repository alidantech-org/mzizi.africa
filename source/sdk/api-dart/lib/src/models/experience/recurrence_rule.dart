import 'package:json_annotation/json_annotation.dart';

part 'recurrence_rule.g.dart';

/// Recurrence Rule
@JsonSerializable(includeIfNull: false)
class ExperienceRecurrenceRule {
  const ExperienceRecurrenceRule({
    this.dayOfMonth,
    this.intervalYears,
    required this.kindCode,
    this.month,
    this.nthWeekday,
    this.rrule,
    this.weekday,
  });
  final int? dayOfMonth;
  final int? intervalYears;
  final String kindCode;
  final int? month;
  final int? nthWeekday;
  final String? rrule;
  final int? weekday;

  factory ExperienceRecurrenceRule.fromJson(Map<String, dynamic> json) => _$ExperienceRecurrenceRuleFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceRecurrenceRuleToJson(this);
}
