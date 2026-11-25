import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/child_entry.dart';

part 'child_collection.g.dart';

/// Child Collection
@JsonSerializable(includeIfNull: false)
class GeographyChildCollection {
  const GeographyChildCollection({required this.children});
  final List<GeographyChildEntry> children;

  factory GeographyChildCollection.fromJson(Map<String, dynamic> json) => _$GeographyChildCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChildCollectionToJson(this);
}
