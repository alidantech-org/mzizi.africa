import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/outline_entry.dart';

part 'outline_collection.g.dart';

/// Outline Collection
@JsonSerializable(includeIfNull: false)
class GeographyOutlineCollection {
  const GeographyOutlineCollection({required this.outlines});
  final List<GeographyOutlineEntry> outlines;

  factory GeographyOutlineCollection.fromJson(Map<String, dynamic> json) => _$GeographyOutlineCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyOutlineCollectionToJson(this);
}
