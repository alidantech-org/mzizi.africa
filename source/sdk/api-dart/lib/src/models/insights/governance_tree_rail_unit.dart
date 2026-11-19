import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_rail_unit.g.dart';

/// Governance Tree Rail Unit
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeRailUnit {
  const InsightsGovernanceTreeRailUnit({
    required this.featureId,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
    this.path,
  });
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String? path;

  factory InsightsGovernanceTreeRailUnit.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeRailUnitFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeRailUnitToJson(this);
}
