import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_parents_relation.g.dart';

/// Institution Detail Parents Relation
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailParentsRelation {
  const InsightsInstitutionDetailParentsRelation({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailParentsRelation.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailParentsRelationFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailParentsRelationToJson(this);
}
