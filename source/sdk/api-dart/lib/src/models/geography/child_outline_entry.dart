import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/child_outline_entry_outlines.dart';

part 'child_outline_entry.g.dart';

/// Child Outline Entry
@JsonSerializable(includeIfNull: false)
class GeographyChildOutlineEntry {
  const GeographyChildOutlineEntry({required this.code, required this.featureId, required this.outlines});
  final String code;
  final String featureId;
  final List<GeographyChildOutlineEntryOutlines> outlines;

  factory GeographyChildOutlineEntry.fromJson(Map<String, dynamic> json) => _$GeographyChildOutlineEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildOutlineEntryToJson(this);
}
