import 'package:json_annotation/json_annotation.dart';

part 'relationship_entry_names.g.dart';

/// Relationship Entry Names
@JsonSerializable(includeIfNull: false)
class GovernanceRelationshipEntryNames {
  const GovernanceRelationshipEntryNames({
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

  factory GovernanceRelationshipEntryNames.fromJson(Map<String, dynamic> json) => _$GovernanceRelationshipEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceRelationshipEntryNamesToJson(this);
}
