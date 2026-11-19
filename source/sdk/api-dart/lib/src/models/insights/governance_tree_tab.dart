import 'package:json_annotation/json_annotation.dart';

part 'governance_tree_tab.g.dart';

/// Governance Tree Tab
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTreeTab {
  const InsightsGovernanceTreeTab({required this.about, required this.code, this.institution, required this.label});
  final String about;
  final String code;
  final String? institution;
  final String label;

  factory InsightsGovernanceTreeTab.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTreeTabFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTreeTabToJson(this);
}
