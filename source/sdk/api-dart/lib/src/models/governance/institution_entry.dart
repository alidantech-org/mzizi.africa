import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/institution_entry_names.dart';

part 'institution_entry.g.dart';

/// Institution Entry
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutionEntry {
  const GovernanceInstitutionEntry({required this.code, required this.id, required this.kind, required this.names});
  final String code;
  final String id;
  final String kind;
  final List<GovernanceInstitutionEntryNames> names;

  factory GovernanceInstitutionEntry.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionEntryToJson(this);
}
