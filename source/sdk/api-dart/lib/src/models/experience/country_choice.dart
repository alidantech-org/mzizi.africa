import 'package:json_annotation/json_annotation.dart';

part 'country_choice.g.dart';

/// Country Choice
@JsonSerializable(includeIfNull: false)
class ExperienceCountryChoice {
  const ExperienceCountryChoice({required this.code, required this.isServed, required this.name});
  final String code;
  final bool isServed;
  final String name;

  factory ExperienceCountryChoice.fromJson(Map<String, dynamic> json) => _$ExperienceCountryChoiceFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCountryChoiceToJson(this);
}
