import 'package:json_annotation/json_annotation.dart';

part 'outline_entry.g.dart';

/// Outline Entry
@JsonSerializable(includeIfNull: false)
class GeographyOutlineEntry {
  const GeographyOutlineEntry({
    required this.band,
    required this.featureId,
    required this.geometryId,
    required this.points,
    required this.roleTerm,
  });
  final int band;
  final String featureId;
  final String geometryId;
  final int points;
  final String roleTerm;

  factory GeographyOutlineEntry.fromJson(Map<String, dynamic> json) => _$GeographyOutlineEntryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyOutlineEntryToJson(this);
}
