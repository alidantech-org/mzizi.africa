import 'package:json_annotation/json_annotation.dart';

part 'institution_detail.g.dart';

/// Institution Detail
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetail {
  const InsightsInstitutionDetail({
    required this.children,
    required this.content,
    required this.gaps,
    required this.institution,
    required this.leaders,
    required this.legalBasis,
    required this.metrics,
    required this.parents,
  });
  final List<Object?> children;
  final List<Object?> content;
  final List<String> gaps;
  final Object? institution;
  final List<Object?> leaders;
  final List<Object?> legalBasis;
  final List<Object?> metrics;
  final List<Object?> parents;

  factory InsightsInstitutionDetail.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailToJson(this);
}
