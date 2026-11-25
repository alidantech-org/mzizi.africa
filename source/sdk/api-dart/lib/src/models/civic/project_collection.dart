import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/project_entry.dart';

part 'project_collection.g.dart';

/// Project Collection
@JsonSerializable(includeIfNull: false)
class CivicProjectCollection {
  const CivicProjectCollection({required this.projects});
  final List<CivicProjectEntry> projects;

  factory CivicProjectCollection.fromJson(Map<String, dynamic> json) => _$CivicProjectCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectCollectionToJson(this);
}
