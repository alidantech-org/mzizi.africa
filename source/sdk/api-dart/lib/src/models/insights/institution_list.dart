import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_list_arms.dart';

part 'institution_list.g.dart';

/// Institution List
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionList {
  const InsightsInstitutionList({required this.arms, required this.gaps, required this.total});
  final List<InsightsInstitutionListArms> arms;
  final List<String> gaps;
  final int total;

  factory InsightsInstitutionList.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionListToJson(this);
}
