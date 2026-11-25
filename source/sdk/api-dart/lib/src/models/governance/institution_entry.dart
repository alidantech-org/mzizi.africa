import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_entry_names.dart';

part 'institution_entry.g.dart';

/// Institution Entry
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionEntry {
  const GovernanceInstitutionEntry({
    this.armTerm,
    this.classTerm,
    required this.code,
    this.fromYear,
    required this.institutionId,
    required this.kindTerm,
    required this.names,
    this.toYear,
  });
  final String? armTerm;
  final String? classTerm;
  final String code;
  final int? fromYear;
  final String institutionId;
  final String kindTerm;
  final List<GovernanceInstitutionEntryNames> names;
  final int? toYear;

  factory GovernanceInstitutionEntry.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionEntryToJson(this);
}
