import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/relationship_entry.dart';

part 'relationship_collection.g.dart';

/// Relationship Collection
@JsonSerializable(includeIfNull: false)
class GovernanceRelationshipCollection {
  const GovernanceRelationshipCollection({required this.relationships});
  final List<GovernanceRelationshipEntry> relationships;

  factory GovernanceRelationshipCollection.fromJson(Map<String, dynamic> json) => _$GovernanceRelationshipCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceRelationshipCollectionToJson(this);
}
