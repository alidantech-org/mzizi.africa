import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_legend.g.dart';

/// Governance Tree Legend
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeLegend {
  const InsightsGovernanceTreeLegend({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsGovernanceTreeLegend.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeLegendFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeLegendToJson(this);
}
