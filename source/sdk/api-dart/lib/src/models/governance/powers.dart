import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/positions.dart';
import 'package:mzizi_api/src/models/governance/procedures.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'powers.g.dart';

/// One right held in law by a position or body over another, with its place in a procedure, the threshold and the provision that creates it. Influence is computed from these rows, never stored.
@JsonSerializable(includeIfNull: false)
class GovernancePowers {
  const GovernancePowers({
    this.basisProvisionId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    this.holderInstitutionId,
    this.holderPositionId,
    required this.id,
    required this.isBinding,
    required this.kindId,
    this.procedureId,
    this.sourceCitationId,
    this.stepOrder,
    this.targetInstitutionId,
    this.targetPositionId,
    this.thresholdId,
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
  final String? holderInstitutionId;
  final String? holderPositionId;
  final String id;
  final bool isBinding;
  final String kindId;
  final String? procedureId;
  final String? sourceCitationId;
  final int? stepOrder;
  final String? targetInstitutionId;
  final String? targetPositionId;
  final String? thresholdId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernancePowers.fromJson(Map<String, dynamic> json) => _$GovernancePowersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePowersToJson(this);
}
