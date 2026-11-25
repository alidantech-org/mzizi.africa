import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/hierarchy_entry_levels_names.dart';

part 'hierarchy_entry_levels.g.dart';

/// Hierarchy Entry Levels
@JsonSerializable(includeIfNull: false)
class ReferenceHierarchyEntryLevels {
  const ReferenceHierarchyEntryLevels({
    required this.code,
    required this.depth,
    required this.kindTerm,
    required this.levelId,
    required this.names,
  });
  final String code;
  final int depth;
  final String kindTerm;
  final String levelId;
  final List<ReferenceHierarchyEntryLevelsNames> names;

  factory ReferenceHierarchyEntryLevels.fromJson(Map<String, dynamic> json) => _$ReferenceHierarchyEntryLevelsFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceHierarchyEntryLevelsToJson(this);
}
