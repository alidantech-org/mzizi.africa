import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_nodes_body.g.dart';

/// Governance Tree Nodes Body
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodesBody {
  const InsightsGovernanceTreeNodesBody({required this.code, required this.name});
  final String code;
  final String name;

  factory InsightsGovernanceTreeNodesBody.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesBodyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesBodyToJson(this);
}
