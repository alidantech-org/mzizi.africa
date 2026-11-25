import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/child_outline_entry.dart';

part 'child_outline_collection.g.dart';

/// Child Outline Collection
@JsonSerializable(includeIfNull: false)
class GeographyChildOutlineCollection {
  const GeographyChildOutlineCollection({required this.children});
  final List<GeographyChildOutlineEntry> children;

  factory GeographyChildOutlineCollection.fromJson(Map<String, dynamic> json) => _$GeographyChildOutlineCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildOutlineCollectionToJson(this);
}
