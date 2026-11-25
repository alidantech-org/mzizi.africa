import 'package:json_annotation/json_annotation.dart';

part 'facility_entry_names.g.dart';

/// Facility Entry Names
@JsonSerializable(includeIfNull: false)
class CivicFacilityEntryNames {
  const CivicFacilityEntryNames({
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

  factory CivicFacilityEntryNames.fromJson(Map<String, dynamic> json) => _$CivicFacilityEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicFacilityEntryNamesToJson(this);
}
