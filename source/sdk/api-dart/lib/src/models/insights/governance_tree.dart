import 'package:json_annotation/json_annotation.dart';
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
    required this.tab,
  });
  final List<Object?> edges;
  final List<String> gaps;
  final List<Object?> legend;
  final List<Object?> nodes;
  final InsightsPlaceCrumb? place;
  final List<Object?> rail;
  final Object? tab;

  factory InsightsGovernanceTree.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeToJson(this);
}
