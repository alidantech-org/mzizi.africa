import 'package:json_annotation/json_annotation.dart';

part 'country_detail_names.g.dart';

/// Country Detail Names
@JsonSerializable(includeIfNull: false)
class ReferenceCountryDetailNames {
  const ReferenceCountryDetailNames({
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

  factory ReferenceCountryDetailNames.fromJson(Map<String, dynamic> json) => _$ReferenceCountryDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryDetailNamesToJson(this);
}
