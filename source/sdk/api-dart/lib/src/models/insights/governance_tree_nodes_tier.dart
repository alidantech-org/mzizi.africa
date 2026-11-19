import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_nodes_tier.g.dart';

/// Governance Tree Nodes Tier
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodesTier {
  const InsightsGovernanceTreeNodesTier({required this.code, required this.label, this.position});
  final String code;
  final String label;
  final double? position;

  factory InsightsGovernanceTreeNodesTier.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesTierFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesTierToJson(this);
}
