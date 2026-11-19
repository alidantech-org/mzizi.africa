import 'package:json_annotation/json_annotation.dart';

part 'governance_tabs_arms_institutions_kind.g.dart';

/// Governance Tabs Arms Institutions Kind
@JsonSerializable(includeIfNull: false)
class InsightsGovernanceTabsArmsInstitutionsKind {
  const InsightsGovernanceTabsArmsInstitutionsKind({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsGovernanceTabsArmsInstitutionsKind.fromJson(Map<String, dynamic> json) =>
      _$InsightsGovernanceTabsArmsInstitutionsKindFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsGovernanceTabsArmsInstitutionsKindToJson(this);
}
