import 'package:json_annotation/json_annotation.dart';

part 'scheme_key.g.dart';

/// Scheme Key
@JsonSerializable(includeIfNull: false)
class VocabularySchemeKey {
  const VocabularySchemeKey({required this.code});
  final String code;

  factory VocabularySchemeKey.fromJson(Map<String, dynamic> json) => _$VocabularySchemeKeyFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularySchemeKeyToJson(this);
}
