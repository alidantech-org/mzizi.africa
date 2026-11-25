import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/governance/obligations.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'reports.g.dart';

/// One report filed (or not) against an obligation.
@JsonSerializable(includeIfNull: false)
class GovernanceReports {
  const GovernanceReports({
    this.artifactId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.dueOn,
    this.filedOn,
    this.fromYear,
    required this.id,
    required this.obligationId,
    required this.reporterId,
    required this.statusTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? artifactId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dueOn;
  final DateTime? filedOn;
  final int? fromYear;
  final String id;
  final String obligationId;
  final String reporterId;
  final String statusTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceReports.fromJson(Map<String, dynamic> json) => _$GovernanceReportsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceReportsToJson(this);
}
