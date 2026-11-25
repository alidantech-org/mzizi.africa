import 'package:json_annotation/json_annotation.dart';

part 'office_entry_holders_names.g.dart';

/// Office Entry Holders Names
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeEntryHoldersNames {
  const GovernanceOfficeEntryHoldersNames({
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

  factory GovernanceOfficeEntryHoldersNames.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeEntryHoldersNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeEntryHoldersNamesToJson(this);
}
