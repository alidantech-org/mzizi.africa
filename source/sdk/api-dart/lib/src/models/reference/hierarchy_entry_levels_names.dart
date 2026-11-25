import 'package:json_annotation/json_annotation.dart';

part 'hierarchy_entry_levels_names.g.dart';

/// Hierarchy Entry Levels Names
@JsonSerializable(includeIfNull: false)
class ReferenceHierarchyEntryLevelsNames {
  const ReferenceHierarchyEntryLevelsNames({
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

  factory ReferenceHierarchyEntryLevelsNames.fromJson(Map<String, dynamic> json) => _$ReferenceHierarchyEntryLevelsNamesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceHierarchyEntryLevelsNamesToJson(this);
}
