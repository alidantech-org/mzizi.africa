import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/levels.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'positions.g.dart';

/// A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it.
@JsonSerializable(includeIfNull: false)
class GovernancePositions {
  const GovernancePositions({
    this.basisProvisionId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.displayOrder,
    this.exposureId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.institutionId,
    this.jurisdictionLevelId,
    required this.roleId,
    required this.seatBasisId,
    this.seatCount,
    this.seatUnitLevelId,
    required this.selectionMethodId,
    this.sourceCitationId,
    this.termLimit,
    this.termYears,
    required this.titleId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? displayOrder;
  final String? exposureId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String institutionId;
  final String? jurisdictionLevelId;
  final String roleId;
  final String seatBasisId;
  final int? seatCount;
  final String? seatUnitLevelId;
  final String selectionMethodId;
  final String? sourceCitationId;
  final int? termLimit;
  final int? termYears;
  final String titleId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernancePositions.fromJson(Map<String, dynamic> json) => _$GovernancePositionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePositionsToJson(this);
}
