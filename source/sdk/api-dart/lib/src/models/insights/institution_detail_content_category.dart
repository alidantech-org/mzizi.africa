import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_content_category.g.dart';

/// Institution Detail Content Category
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailContentCategory {
  const InsightsInstitutionDetailContentCategory({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailContentCategory.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailContentCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailContentCategoryToJson(this);
}
