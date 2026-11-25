import 'package:json_annotation/json_annotation.dart';

part 'place_entry_names.g.dart';

/// Place Entry Names
@JsonSerializable(includeIfNull: false)
class GeographyPlaceEntryNames {
  const GeographyPlaceEntryNames({
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

  factory GeographyPlaceEntryNames.fromJson(Map<String, dynamic> json) => _$GeographyPlaceEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceEntryNamesToJson(this);
}
