import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'beneficiaries.g.dart';

/// Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles.
@JsonSerializable(includeIfNull: false)
class CivicBeneficiaries {
  const CivicBeneficiaries({
    required this.benefitKindId,
    required this.code,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.procurementId,
    this.projectId,
    this.sharePercent,
    this.sourceCitationId,
    required this.subjectId,
    required this.subjectTable,
    required this.updatedAt,
    required this.version,
  });
  final String benefitKindId;
  final String code;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? procurementId;
  final String? projectId;
  final double? sharePercent;
  final String? sourceCitationId;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final DateTime updatedAt;
  final int version;

  factory CivicBeneficiaries.fromJson(Map<String, dynamic> json) => _$CivicBeneficiariesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicBeneficiariesToJson(this);
}
