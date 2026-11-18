import 'package:json_annotation/json_annotation.dart';

part 'calendar_input.g.dart';

/// Calendar Input
@JsonSerializable(includeIfNull: false)
class ExperienceCalendarInput {
  const ExperienceCalendarInput({this.featureId, this.from, this.kindCode, this.languageCode, this.to});
  final String? featureId;
  final DateTime? from;
  final String? kindCode;
  final String? languageCode;
  final DateTime? to;

  factory ExperienceCalendarInput.fromJson(Map<String, dynamic> json) => _$ExperienceCalendarInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCalendarInputToJson(this);
}
