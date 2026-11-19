import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_content_classification.g.dart';

/// Institution Detail Content Classification
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailContentClassification {
  const InsightsInstitutionDetailContentClassification({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsInstitutionDetailContentClassification.fromJson(Map<String, dynamic> json) =>
      _$InsightsInstitutionDetailContentClassificationFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailContentClassificationToJson(this);
}
