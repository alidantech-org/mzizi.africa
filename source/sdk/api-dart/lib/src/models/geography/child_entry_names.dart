import 'package:json_annotation/json_annotation.dart';

part 'child_entry_names.g.dart';

/// Child Entry Names
@JsonSerializable(includeIfNull: false)
class GeographyChildEntryNames {
  const GeographyChildEntryNames({
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

  factory GeographyChildEntryNames.fromJson(Map<String, dynamic> json) => _$GeographyChildEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildEntryNamesToJson(this);
}
