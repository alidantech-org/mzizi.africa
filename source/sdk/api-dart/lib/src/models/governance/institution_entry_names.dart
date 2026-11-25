import 'package:json_annotation/json_annotation.dart';

part 'institution_entry_names.g.dart';

/// Institution Entry Names
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionEntryNames {
  const GovernanceInstitutionEntryNames({
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

  factory GovernanceInstitutionEntryNames.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionEntryNamesToJson(this);
}
