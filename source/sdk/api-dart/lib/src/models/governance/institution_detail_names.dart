import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_names.g.dart';

/// Institution Detail Names
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailNames {
  const GovernanceInstitutionDetailNames({
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

  factory GovernanceInstitutionDetailNames.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailNamesToJson(this);
}
