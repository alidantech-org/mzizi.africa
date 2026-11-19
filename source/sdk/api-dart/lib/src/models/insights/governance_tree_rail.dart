import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_rail_refs.dart';
import 'package:mzizi_api/src/models/insights/governance_tree_rail_unit.dart';

part 'governance_tree_rail.g.dart';

/// Governance Tree Rail
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeRail {
  const InsightsGovernanceTreeRail({
    required this.about,
    required this.code,
    required this.count,
    required this.label,
    required this.refs,
    this.unit,
  });
  final String about;
  final String code;
  final double count;
  final String label;
  final InsightsGovernanceTreeRailRefs refs;
  final InsightsGovernanceTreeRailUnit? unit;

  factory InsightsGovernanceTreeRail.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeRailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeRailToJson(this);
}
