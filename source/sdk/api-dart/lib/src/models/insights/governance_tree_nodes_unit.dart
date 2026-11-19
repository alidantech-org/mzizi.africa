import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_nodes_unit.g.dart';

/// Governance Tree Nodes Unit
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodesUnit {
  const InsightsGovernanceTreeNodesUnit({required this.featureId, required this.name, this.path});
  final String featureId;
  final String name;
  final String? path;

  factory InsightsGovernanceTreeNodesUnit.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesUnitFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesUnitToJson(this);
}
