import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/governance_tabs_arms_institutions_kind.dart';

part 'governance_tabs_arms_institutions.g.dart';

/// Governance Tabs Arms Institutions
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTabsArmsInstitutions {
  const InsightsGovernanceTabsArmsInstitutions({required this.code, this.image, required this.kind, required this.leaders, required this.name});
  final String code;
  final String? image;
  final InsightsGovernanceTabsArmsInstitutionsKind kind;
  final double leaders;
  final String name;

  factory InsightsGovernanceTabsArmsInstitutions.fromJson(Map<String, dynamic> json) => _$InsightsGovernanceTabsArmsInstitutionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTabsArmsInstitutionsToJson(this);
}
