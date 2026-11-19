import 'package:json_annotation/json_annotation.dart';

part 'institution_list_arms_groups_institutions_arm.g.dart';

/// Institution List Arms Groups Institutions Arm
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroupsInstitutionsArm {
  const InsightsInstitutionListArmsGroupsInstitutionsArm({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionListArmsGroupsInstitutionsArm.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionListArmsGroupsInstitutionsArmFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsInstitutionsArmToJson(this);
}
