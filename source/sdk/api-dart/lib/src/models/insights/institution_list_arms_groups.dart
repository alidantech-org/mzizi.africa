import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups_kind.dart';

part 'institution_list_arms_groups.g.dart';

/// Institution List Arms Groups
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroups {
  const InsightsInstitutionListArmsGroups({required this.institutions, required this.kind});
  final List<InsightsInstitutionListArmsGroupsInstitutions> institutions;
  final InsightsInstitutionListArmsGroupsKind kind;

  factory InsightsInstitutionListArmsGroups.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionListArmsGroupsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsToJson(this);
}
