import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/text_direction.dart';

part 'localized_text.g.dart';

/// Localized Text
@JsonSerializable(includeIfNull: false)
class SharedLocalizedText {
  const SharedLocalizedText({required this.direction, required this.isFallback, required this.language, required this.text});
  final SharedTextDirection direction;
  final bool isFallback;
  final String language;
  final String text;

  factory SharedLocalizedText.fromJson(Map<String, dynamic> json) => _$SharedLocalizedTextFromJson(json);

  Map<String, dynamic> toJson() => _$SharedLocalizedTextToJson(this);
}
