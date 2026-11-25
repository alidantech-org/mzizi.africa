import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'office_terms.g.dart';

/// A numbered term or mandate of an institution or office (absorbs the former mandates).
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeTerms {
  const GovernanceOfficeTerms({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.featureId,
    this.fromYear,
    required this.id,
    this.institutionId,
    required this.kindTerm,
    this.officeId,
    this.ordinal,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String? featureId;
  final int? fromYear;
  final String id;
  final String? institutionId;
  final String kindTerm;
  final String? officeId;
  final int? ordinal;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceOfficeTerms.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeTermsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeTermsToJson(this);
}
