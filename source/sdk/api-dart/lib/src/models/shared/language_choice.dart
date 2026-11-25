import 'package:json_annotation/json_annotation.dart';

part 'language_choice.g.dart';

/// Language Choice
@JsonSerializable(includeIfNull: false)
class SharedLanguageChoice {
  const SharedLanguageChoice({this.lang});
  final String? lang;

  factory SharedLanguageChoice.fromJson(Map<String, dynamic> json) => _$SharedLanguageChoiceFromJson(json);

  Map<String, dynamic> toJson() => _$SharedLanguageChoiceToJson(this);
}
