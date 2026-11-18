import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'terms.g.dart';

/// A fixed period for which offices are filled: a presidential term, a parliament, a county assembly. Elections, by-elections, mandates and sittings belong to a term.
@JsonSerializable(includeIfNull: false)
class GovernanceTerms {
  const GovernanceTerms({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    required this.id,
    this.institutionId,
    this.ordinal,
    this.sourceCitationId,
    required this.startsOn,
    required this.termKindId,
    this.unitFeatureId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String id;
  final String? institutionId;
  final int? ordinal;
  final String? sourceCitationId;
  final DateTime startsOn;
  final String termKindId;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceTerms.fromJson(Map<String, dynamic> json) => _$GovernanceTermsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceTermsToJson(this);
}
