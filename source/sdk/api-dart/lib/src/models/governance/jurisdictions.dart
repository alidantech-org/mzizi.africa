import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'jurisdictions.g.dart';

/// Where an institution or office has authority.
@JsonSerializable(includeIfNull: false)
class GovernanceJurisdictions {
  const GovernanceJurisdictions({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.featureId,
    this.fromYear,
    required this.id,
    this.institutionId,
    required this.kindTerm,
    this.officeId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? featureId;
  final int? fromYear;
  final String id;
  final String? institutionId;
  final String kindTerm;
  final String? officeId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceJurisdictions.fromJson(Map<String, dynamic> json) => _$GovernanceJurisdictionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceJurisdictionsToJson(this);
}
