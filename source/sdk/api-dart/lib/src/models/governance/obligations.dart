import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'obligations.g.dart';

/// A duty to report or publish, with who owes it, to whom, how often and the law that creates it. Each filing found is a report.
@JsonSerializable(includeIfNull: false)
class GovernanceObligations {
  const GovernanceObligations({
    this.basisProvisionId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.description,
    required this.frequencyId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.obligationKindId,
    this.obligorInstitutionId,
    this.obligorKindId,
    this.recipientEntityId,
    this.sourceCitationId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String description;
  final String frequencyId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String obligationKindId;
  final String? obligorInstitutionId;
  final String? obligorKindId;
  final String? recipientEntityId;
  final String? sourceCitationId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceObligations.fromJson(Map<String, dynamic> json) => _$GovernanceObligationsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceObligationsToJson(this);
}
