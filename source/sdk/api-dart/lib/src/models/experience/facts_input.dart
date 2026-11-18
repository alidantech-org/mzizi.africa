import 'package:json_annotation/json_annotation.dart';

part 'facts_input.g.dart';

/// Facts Input
@JsonSerializable(includeIfNull: false)
class ExperienceFactsInput {
  const ExperienceFactsInput({this.featureId, this.limit});
  final String? featureId;
  final int? limit;

  factory ExperienceFactsInput.fromJson(Map<String, dynamic> json) => _$ExperienceFactsInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFactsInputToJson(this);
}
