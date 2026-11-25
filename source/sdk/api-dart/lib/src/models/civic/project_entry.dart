import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/project_entry_names.dart';

part 'project_entry.g.dart';

/// Project Entry
@JsonSerializable(includeIfNull: false)
class CivicProjectEntry {
  const CivicProjectEntry({
    required this.code,
    this.fromYear,
    required this.names,
    required this.projectId,
    required this.siteKindTerm,
    required this.statusTerm,
    this.toYear,
  });
  final String code;
  final int? fromYear;
  final List<CivicProjectEntryNames> names;
  final String projectId;
  final String siteKindTerm;
  final String statusTerm;
  final int? toYear;

  factory CivicProjectEntry.fromJson(Map<String, dynamic> json) => _$CivicProjectEntryFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectEntryToJson(this);
}
