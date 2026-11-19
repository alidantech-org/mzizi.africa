import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_edges.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_legend.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_nodes.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_rail.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_tab.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'governance_tree.g.dart';

/// Governance Tree
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTree {
  const InsightsGovernanceTree({
    required this.edges,
    required this.gaps,
    required this.legend,
    required this.nodes,
    this.place,
    required this.rail,
    this.tab,
  });
  final List<InsightsGovernanceTreeEdges> edges;
  final List<String> gaps;
  final List<InsightsGovernanceTreeLegend> legend;
  final List<InsightsGovernanceTreeNodes> nodes;
  final InsightsPlaceCrumb? place;
  final List<InsightsGovernanceTreeRail> rail;
  final InsightsGovernanceTreeTab? tab;

  factory InsightsGovernanceTree.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeToJson(this);
}
