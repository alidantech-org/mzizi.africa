import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/text_direction.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'language_option.g.dart';

/// Language Option
@JsonSerializable(includeIfNull: false)
class FrontendLanguageOption {
  const FrontendLanguageOption({required this.code, required this.direction, required this.name, required this.tag});
  final String code;
  final SharedTextDirection direction;
  final SharedLocalizedText name;
  final String tag;

  factory FrontendLanguageOption.fromJson(Map<String, dynamic> json) => _$FrontendLanguageOptionFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendLanguageOptionToJson(this);
}
