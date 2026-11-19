import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/governance_tabs_arms_institutions.dart';

part 'governance_tabs_arms.g.dart';

/// Governance Tabs Arms
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTabsArms {
  const InsightsGovernanceTabsArms({required this.about, required this.code, required this.institutions, required this.label});
  final String about;
  final String code;
  final List<InsightsGovernanceTabsArmsInstitutions> institutions;
  final String label;

  factory InsightsGovernanceTabsArms.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTabsArmsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTabsArmsToJson(this);
}
