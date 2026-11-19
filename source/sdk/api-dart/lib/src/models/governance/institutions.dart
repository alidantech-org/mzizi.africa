import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'institutions.g.dart';

/// One government institution specialization of an Official entity.
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutions {
  const GovernanceInstitutions({
    this.armId,
    this.classId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.dissolvedOn,
    required this.entityId,
    this.establishedOn,
    this.establishmentBasisId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.institutionKindId,
    this.sourceCitationId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? armId;
  final String? classId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dissolvedOn;
  final String entityId;
  final DateTime? establishedOn;
  final String? establishmentBasisId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String institutionKindId;
  final String? sourceCitationId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceInstitutions.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionsToJson(this);
}
