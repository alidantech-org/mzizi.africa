import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_children_relation.dart';

part 'institution_detail_children.g.dart';

/// Institution Detail Children
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailChildren {
  const InsightsInstitutionDetailChildren({required this.children, required this.code, required this.name, required this.relation});
  final double children;
  final String code;
  final String name;
  final InsightsInstitutionDetailChildrenRelation relation;

  factory InsightsInstitutionDetailChildren.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailChildrenFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailChildrenToJson(this);
}
