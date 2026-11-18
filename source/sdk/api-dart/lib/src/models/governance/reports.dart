import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/obligations.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/artifacts.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'reports.g.dart';

/// One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row.
@JsonSerializable(includeIfNull: false)
class GovernanceReports {
  const GovernanceReports({
    this.artifactId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.dueOn,
    this.filedOn,
    required this.id,
    required this.obligationId,
    this.periodFrom,
    this.periodUntil,
    required this.reporterEntityId,
    this.sourceCitationId,
    required this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final String? artifactId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dueOn;
  final DateTime? filedOn;
  final String id;
  final String obligationId;
  final DateTime? periodFrom;
  final DateTime? periodUntil;
  final String reporterEntityId;
  final String? sourceCitationId;
  final String statusId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceReports.fromJson(Map<String, dynamic> json) => _$GovernanceReportsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceReportsToJson(this);
}
