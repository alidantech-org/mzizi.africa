import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_names.g.dart';

/// Institution Detail Names
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionDetailNames {
  const GovernanceInstitutionDetailNames({required this.isPreferred, this.languageTag, required this.name});
  final bool isPreferred;
  final String? languageTag;
  final String name;

  factory GovernanceInstitutionDetailNames.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionDetailNamesToJson(this);
}
