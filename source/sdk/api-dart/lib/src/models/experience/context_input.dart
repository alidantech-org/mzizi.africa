import 'package:json_annotation/json_annotation.dart';

part 'context_input.g.dart';

/// Context Input
@JsonSerializable(includeIfNull: false)
class ExperienceContextInput {
  const ExperienceContextInput({this.countryCode, this.edgeCountry, this.featureId, this.languageCode, this.path});
  final String? countryCode;
  final String? edgeCountry;
  final String? featureId;
  final String? languageCode;
  final String? path;

  factory ExperienceContextInput.fromJson(Map<String, dynamic> json) => _$ExperienceContextInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceContextInputToJson(this);
}
