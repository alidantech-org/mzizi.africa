import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/functions.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'assignments.g.dart';

/// Who is responsible for a function, how it is shared, where a person starts, and the law that assigns it.
@JsonSerializable(includeIfNull: false)
class GovernanceAssignments {
  const GovernanceAssignments({
    this.basisProvisionId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.functionId,
    required this.id,
    this.institutionId,
    this.obligorKindId,
    required this.shareId,
    this.sourceCitationId,
    this.startInstitutionId,
    this.startPositionId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String functionId;
  final String id;
  final String? institutionId;
  final String? obligorKindId;
  final String shareId;
  final String? sourceCitationId;
  final String? startInstitutionId;
  final String? startPositionId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceAssignments.fromJson(Map<String, dynamic> json) => _$GovernanceAssignmentsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceAssignmentsToJson(this);
}
