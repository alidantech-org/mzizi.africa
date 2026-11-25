import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/relationship_entry_names.dart';

part 'relationship_entry.g.dart';

/// Relationship Entry
@JsonSerializable(includeIfNull: false)
class GovernanceRelationshipEntry {
  const GovernanceRelationshipEntry({
    required this.fromCode,
    required this.fromId,
    this.fromYear,
    required this.kindTerm,
    required this.names,
    this.toYear,
  });
  final String fromCode;
  final String fromId;
  final int? fromYear;
  final String kindTerm;
  final List<GovernanceRelationshipEntryNames> names;
  final int? toYear;

  factory GovernanceRelationshipEntry.fromJson(Map<String, dynamic> json) => _$GovernanceRelationshipEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceRelationshipEntryToJson(this);
}
