import 'package:json_annotation/json_annotation.dart';

part 'child_outline_entry_outlines.g.dart';

/// Child Outline Entry Outlines
@JsonSerializable(includeIfNull: false)
class GeographyChildOutlineEntryOutlines {
  const GeographyChildOutlineEntryOutlines({required this.band});
  final int band;

  factory GeographyChildOutlineEntryOutlines.fromJson(Map<String, dynamic> json) => _$GeographyChildOutlineEntryOutlinesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildOutlineEntryOutlinesToJson(this);
}
