import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_edges.g.dart';

/// Governance Tree Edges
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeEdges {
  const InsightsGovernanceTreeEdges({required this.from, required this.kind, required this.to});
  final String from;
  final String kind;
  final String to;

  factory InsightsGovernanceTreeEdges.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeEdgesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeEdgesToJson(this);
}
