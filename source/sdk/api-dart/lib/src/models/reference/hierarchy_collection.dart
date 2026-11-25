import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/hierarchy_entry.dart';

part 'hierarchy_collection.g.dart';

/// Hierarchy Collection
@JsonSerializable(includeIfNull: false)
class ReferenceHierarchyCollection {
  const ReferenceHierarchyCollection({required this.hierarchies});
  final List<ReferenceHierarchyEntry> hierarchies;

  factory ReferenceHierarchyCollection.fromJson(Map<String, dynamic> json) => _$ReferenceHierarchyCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceHierarchyCollectionToJson(this);
}
