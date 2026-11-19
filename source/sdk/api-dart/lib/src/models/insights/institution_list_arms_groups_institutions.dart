import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_arm.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_basis.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_kind.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_parent.dart';

part 'institution_list_arms_groups_institutions.g.dart';

/// Institution List Arms Groups Institutions
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArmsGroupsInstitutions {
  const InsightsInstitutionListArmsGroupsInstitutions({
    required this.arm,
    required this.basis,
    required this.children,
    required this.code,
    this.image,
    required this.kind,
    required this.leaders,
    required this.name,
    this.parent,
    required this.purpose,
  });
  final InsightsInstitutionListArmsGroupsInstitutionsArm arm;
  final InsightsInstitutionListArmsGroupsInstitutionsBasis basis;
  final double children;
  final String code;
  final String? image;
  final InsightsInstitutionListArmsGroupsInstitutionsKind kind;
  final double leaders;
  final String name;
  final InsightsInstitutionListArmsGroupsInstitutionsParent? parent;
  final String purpose;

  factory InsightsInstitutionListArmsGroupsInstitutions.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionListArmsGroupsInstitutionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsGroupsInstitutionsToJson(this);
}
