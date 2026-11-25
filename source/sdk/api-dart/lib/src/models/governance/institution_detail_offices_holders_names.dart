import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_offices_holders_names.g.dart';

/// Institution Detail Offices Holders Names
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailOfficesHoldersNames {
  const GovernanceInstitutionDetailOfficesHoldersNames({
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

  factory GovernanceInstitutionDetailOfficesHoldersNames.fromJson(Map<String, dynamic> json) =>
      _$GovernanceInstitutionDetailOfficesHoldersNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailOfficesHoldersNamesToJson(this);
}
