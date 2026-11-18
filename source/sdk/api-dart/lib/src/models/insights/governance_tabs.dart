import 'package:json_annotation/json_annotation.dart';

part 'governance_tabs.g.dart';

/// Governance Tabs
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTabs {
  const InsightsGovernanceTabs({required this.arms, required this.gaps, required this.tabs});
  final List<Object?> arms;
  final List<String> gaps;
  final List<Object?> tabs;

  factory InsightsGovernanceTabs.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTabsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTabsToJson(this);
}
