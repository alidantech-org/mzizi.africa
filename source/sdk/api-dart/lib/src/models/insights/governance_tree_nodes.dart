import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes_body.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes_how.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes_performance.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes_refs.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes_tier.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes_unit.dart';

part 'governance_tree_nodes.g.dart';

/// Governance Tree Nodes
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodes {
  const InsightsGovernanceTreeNodes({
    this.arm,
    this.basis,
    this.body,
    this.code,
    this.holderId,
    this.how,
    required this.id,
    this.kind,
    this.leaderSlug,
    this.leaders,
    required this.level,
    required this.name,
    this.party,
    this.performance,
    this.photo,
    this.purpose,
    required this.refs,
    this.since,
    this.tier,
    required this.type,
    this.unit,
  });
  final String? arm;
  final String? basis;
  final InsightsGovernanceTreeNodesBody? body;
  final String? code;
  final String? holderId;
  final InsightsGovernanceTreeNodesHow? how;
  final String id;
  final String? kind;
  final String? leaderSlug;
  final double? leaders;
  final String level;
  final String name;
  final String? party;
  final InsightsGovernanceTreeNodesPerformance? performance;
  final String? photo;
  final String? purpose;
  final InsightsGovernanceTreeNodesRefs refs;
  final String? since;
  final InsightsGovernanceTreeNodesTier? tier;
  final String type;
  final InsightsGovernanceTreeNodesUnit? unit;

  factory InsightsGovernanceTreeNodes.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesToJson(this);
}
