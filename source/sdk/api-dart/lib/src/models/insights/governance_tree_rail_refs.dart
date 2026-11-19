import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_rail_refs.g.dart';

/// Governance Tree Rail Refs
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeRailRefs {
  const InsightsGovernanceTreeRailRefs({required this.code, required this.kind, required this.table});
  final String code;
  final String kind;
  final String table;

  factory InsightsGovernanceTreeRailRefs.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeRailRefsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeRailRefsToJson(this);
}
