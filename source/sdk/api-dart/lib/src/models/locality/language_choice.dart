import 'package:json_annotation/json_annotation.dart';

part 'language_choice.g.dart';

/// Language Choice
@JsonSerializable(includeIfNull: false)
class LocalityLanguageChoice {
  const LocalityLanguageChoice({required this.code, required this.name, this.nativeName});
  final String code;
  final String name;
  final String? nativeName;

  factory LocalityLanguageChoice.fromJson(Map<String, dynamic> json) => _$LocalityLanguageChoiceFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityLanguageChoiceToJson(this);
}
