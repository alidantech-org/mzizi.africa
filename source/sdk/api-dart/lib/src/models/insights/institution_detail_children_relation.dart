import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_children_relation.g.dart';

/// Institution Detail Children Relation
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailChildrenRelation {
  const InsightsInstitutionDetailChildrenRelation({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailChildrenRelation.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailChildrenRelationFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailChildrenRelationToJson(this);
}
