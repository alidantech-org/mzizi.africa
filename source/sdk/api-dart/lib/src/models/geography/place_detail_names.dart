import 'package:json_annotation/json_annotation.dart';

part 'place_detail_names.g.dart';

/// Place Detail Names
@JsonSerializable(includeIfNull: false)
class GeographyPlaceDetailNames {
  const GeographyPlaceDetailNames({
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

  factory GeographyPlaceDetailNames.fromJson(Map<String, dynamic> json) => _$GeographyPlaceDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceDetailNamesToJson(this);
}
