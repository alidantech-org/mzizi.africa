import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/hierarchy_entry_levels.dart';
import 'package:mzizi_api/src/models/reference/hierarchy_entry_names.dart';

part 'hierarchy_entry.g.dart';

/// Hierarchy Entry
@JsonSerializable(includeIfNull: false)
class ReferenceHierarchyEntry {
  const ReferenceHierarchyEntry({
    required this.code,
    this.fromYear,
    required this.hierarchyId,
    required this.isRouting,
    required this.kindTerm,
    required this.levels,
    required this.names,
    this.toYear,
  });
  final String code;
  final int? fromYear;
  final String hierarchyId;
  final bool isRouting;
  final String kindTerm;
  final List<ReferenceHierarchyEntryLevels> levels;
  final List<ReferenceHierarchyEntryNames> names;
  final int? toYear;

  factory ReferenceHierarchyEntry.fromJson(Map<String, dynamic> json) => _$ReferenceHierarchyEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceHierarchyEntryToJson(this);
}
