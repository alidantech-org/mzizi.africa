import 'package:json_annotation/json_annotation.dart';

part 'language_entry_names.g.dart';

/// Language Entry Names
@JsonSerializable(includeIfNull: false)
class ReferenceLanguageEntryNames {
  const ReferenceLanguageEntryNames({
    this.fromYear,
    required this.isDefault,
    required this.kindTerm,
    required this.languageCode,
    this.languageIso,
    required this.text,
    this.toYear,
  });
  final int? fromYear;
  final bool isDefault;
  final String kindTerm;
  final String languageCode;
  final String? languageIso;
  final String text;
  final int? toYear;

  factory ReferenceLanguageEntryNames.fromJson(Map<String, dynamic> json) => _$ReferenceLanguageEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLanguageEntryNamesToJson(this);
}
