import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/child_entry_names.dart';

part 'child_entry.g.dart';

/// Child Entry
@JsonSerializable(includeIfNull: false)
class GeographyChildEntry {
  const GeographyChildEntry({
    required this.code,
    required this.featureId,
    this.hierarchyId,
    required this.kindTerm,
    this.levelId,
    required this.names,
  });
  final String code;
  final String featureId;
  final String? hierarchyId;
  final String kindTerm;
  final String? levelId;
  final List<GeographyChildEntryNames> names;

  factory GeographyChildEntry.fromJson(Map<String, dynamic> json) => _$GeographyChildEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildEntryToJson(this);
}
