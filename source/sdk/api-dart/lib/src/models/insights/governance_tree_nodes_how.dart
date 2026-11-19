import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_nodes_how.g.dart';

/// Governance Tree Nodes How
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodesHow {
  const InsightsGovernanceTreeNodesHow({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsGovernanceTreeNodesHow.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesHowFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesHowToJson(this);
}
