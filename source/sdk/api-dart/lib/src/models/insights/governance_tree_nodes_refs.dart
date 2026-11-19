import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_nodes_refs.g.dart';

/// Governance Tree Nodes Refs
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeNodesRefs {
  const InsightsGovernanceTreeNodesRefs({
    this.appointment,
    this.basis,
    this.code,
    this.institution,
    this.office,
    required this.scheme,
    this.table,
    this.tier,
    this.value,
  });
  final String? appointment;
  final String? basis;
  final String? code;
  final String? institution;
  final String? office;
  final String scheme;
  final String? table;
  final String? tier;
  final String? value;

  factory InsightsGovernanceTreeNodesRefs.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeNodesRefsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeNodesRefsToJson(this);
}
