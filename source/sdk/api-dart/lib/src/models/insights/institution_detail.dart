import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_children.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_content.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_institution.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_leaders.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_legal_basis.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_metrics.dart';
import 'package:mzizi_api/src/models/insights/institution_detail_parents.dart';

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
  final List<InsightsInstitutionDetailChildren> children;
  final List<InsightsInstitutionDetailContent> content;
  final List<String> gaps;
  final InsightsInstitutionDetailInstitution institution;
  final List<InsightsInstitutionDetailLeaders> leaders;
  final List<InsightsInstitutionDetailLegalBasis> legalBasis;
  final List<InsightsInstitutionDetailMetrics> metrics;
  final List<InsightsInstitutionDetailParents> parents;

  factory InsightsInstitutionDetail.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailToJson(this);
}
