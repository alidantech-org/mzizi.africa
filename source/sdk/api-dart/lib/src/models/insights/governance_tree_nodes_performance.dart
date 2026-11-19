import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_nodes_performance.g.dart';

/// Governance Tree Nodes Performance
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodesPerformance {
  const InsightsGovernanceTreeNodesPerformance({
    required this.basis,
    required this.of,
    required this.rank,
    required this.samples,
    required this.score,
    required this.text,
  });
  final String basis;
  final double of;
  final double rank;
  final double samples;
  final double score;
  final String text;

  factory InsightsGovernanceTreeNodesPerformance.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesPerformanceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesPerformanceToJson(this);
}
