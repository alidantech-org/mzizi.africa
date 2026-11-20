import 'package:json_annotation/json_annotation.dart';

part 'language_choice.g.dart';

/// Language Choice
@JsonSerializable(includeIfNull: false)
class ExplorerLanguageChoice {
  const ExplorerLanguageChoice({required this.code, required this.name, this.nativeName});
  final String code;
  final String name;
  final String? nativeName;

  factory ExplorerLanguageChoice.fromJson(Map<String, dynamic> json) => _$ExplorerLanguageChoiceFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerLanguageChoiceToJson(this);
}
