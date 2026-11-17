import 'package:json_annotation/json_annotation.dart';

part 'institution_entry_names.g.dart';

/// Institution Entry Names
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionEntryNames {
  const GovernanceInstitutionEntryNames({required this.isPreferred, this.languageTag, required this.name});
  final bool isPreferred;
  final String? languageTag;
  final String name;

  factory GovernanceInstitutionEntryNames.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionEntryNamesToJson(this);
}
