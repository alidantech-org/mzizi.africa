import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'authority_scopes.g.dart';

/// One institution or office authority over a required Geography unit for an effective period.
@JsonSerializable(includeIfNull: false)
class GovernanceAuthorityScopes {
  const GovernanceAuthorityScopes({
    required this.authorityKindId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.institutionId,
    this.officeId,
    this.sourceCitationId,
    required this.unitFeatureId,
    required this.updatedAt,
    required this.version,
  });
  final String authorityKindId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? institutionId;
  final String? officeId;
  final String? sourceCitationId;
  final String unitFeatureId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceAuthorityScopes.fromJson(Map<String, dynamic> json) => _$GovernanceAuthorityScopesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceAuthorityScopesToJson(this);
}
