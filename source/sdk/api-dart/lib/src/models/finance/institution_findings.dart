import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'institution_findings.g.dart';

/// Institution Findings
@JsonSerializable(includeIfNull: false)
class FinanceInstitutionFindings {
  const FinanceInstitutionFindings({required this.institutionId, this.limit, this.offset});
  final String institutionId;
  final int? limit;
  final int? offset;

  factory FinanceInstitutionFindings.fromJson(Map<String, dynamic> json) => _$FinanceInstitutionFindingsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceInstitutionFindingsToJson(this);
}
