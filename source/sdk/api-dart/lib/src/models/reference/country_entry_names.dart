import 'package:json_annotation/json_annotation.dart';

part 'country_entry_names.g.dart';

/// Country Entry Names
@JsonSerializable(includeIfNull: false)
class ReferenceCountryEntryNames {
  const ReferenceCountryEntryNames({
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

  factory ReferenceCountryEntryNames.fromJson(Map<String, dynamic> json) => _$ReferenceCountryEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryEntryNamesToJson(this);
}
