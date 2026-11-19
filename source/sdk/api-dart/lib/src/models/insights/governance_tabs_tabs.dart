import 'package:json_annotation/json_annotation.dart';

part 'governance_tabs_tabs.g.dart';

/// Governance Tabs Tabs
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTabsTabs {
  const InsightsGovernanceTabsTabs({
    required this.about,
    required this.code,
    required this.count,
    required this.includes,
    required this.kind,
    required this.label,
  });
  final String about;
  final String code;
  final double count;
  final List<String> includes;
  final String kind;
  final String label;

  factory InsightsGovernanceTabsTabs.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTabsTabsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTabsTabsToJson(this);
}
