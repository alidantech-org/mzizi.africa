import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_offices_names.g.dart';

/// Institution Detail Offices Names
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailOfficesNames {
  const GovernanceInstitutionDetailOfficesNames({
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

  factory GovernanceInstitutionDetailOfficesNames.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailOfficesNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailOfficesNamesToJson(this);
}
