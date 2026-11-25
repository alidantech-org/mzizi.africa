import 'package:json_annotation/json_annotation.dart';

part 'office_entry_names.g.dart';

/// Office Entry Names
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeEntryNames {
  const GovernanceOfficeEntryNames({
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

  factory GovernanceOfficeEntryNames.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeEntryNamesToJson(this);
}
