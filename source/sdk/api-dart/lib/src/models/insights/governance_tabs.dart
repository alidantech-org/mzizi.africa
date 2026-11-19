import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/governance_tabs_arms.dart';
import 'package:mzizi_api/src/models/insights/governance_tabs_tabs.dart';

part 'governance_tabs.g.dart';

/// Governance Tabs
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTabs {
  const InsightsGovernanceTabs({required this.arms, required this.gaps, required this.tabs});
  final List<InsightsGovernanceTabsArms> arms;
  final List<String> gaps;
  final List<InsightsGovernanceTabsTabs> tabs;

  factory InsightsGovernanceTabs.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTabsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTabsToJson(this);
}
