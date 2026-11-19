import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms_groups.dart';

part 'institution_list_arms.g.dart';

/// Institution List Arms
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionListArms {
  const InsightsInstitutionListArms({required this.about, required this.code, required this.count, required this.groups, required this.label});
  final String about;
  final String code;
  final double count;
  final List<InsightsInstitutionListArmsGroups> groups;
  final String label;

  factory InsightsInstitutionListArms.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionListArmsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListArmsToJson(this);
}
