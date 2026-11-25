import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/functions.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'assignments.g.dart';

/// Which institution or position carries a function, and who leads it.
@JsonSerializable(includeIfNull: false)
class GovernanceAssignments {
  const GovernanceAssignments({
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.functionId,
    required this.id,
    this.initiatorId,
    this.institutionId,
    this.positionId,
    this.provisionId,
    required this.shareTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String functionId;
  final String id;
  final String? initiatorId;
  final String? institutionId;
  final String? positionId;
  final String? provisionId;
  final String shareTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceAssignments.fromJson(Map<String, dynamic> json) => _$GovernanceAssignmentsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceAssignmentsToJson(this);
}
