import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_parents_relation.dart';

part 'institution_detail_parents.g.dart';

/// Institution Detail Parents
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailParents {
  const InsightsInstitutionDetailParents({required this.children, required this.code, required this.name, required this.relation});
  final double children;
  final String code;
  final String name;
  final InsightsInstitutionDetailParentsRelation relation;

  factory InsightsInstitutionDetailParents.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailParentsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailParentsToJson(this);
}
