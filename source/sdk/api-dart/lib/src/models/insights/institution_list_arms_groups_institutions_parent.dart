import 'package:json_annotation/json_annotation.dart';

part 'institution_list_arms_groups_institutions_parent.g.dart';

/// Institution List Arms Groups Institutions Parent
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroupsInstitutionsParent {
  const InsightsInstitutionListArmsGroupsInstitutionsParent({required this.code, required this.name});
  final String code;
  final String name;

  factory InsightsInstitutionListArmsGroupsInstitutionsParent.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionListArmsGroupsInstitutionsParentFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsInstitutionsParentToJson(this);
}
