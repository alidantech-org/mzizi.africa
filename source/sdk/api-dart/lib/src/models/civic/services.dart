import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/jurisdictions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'services.g.dart';

/// A public service. Its names and descriptions are `identity.names`.
@JsonSerializable(includeIfNull: false)
class CivicServices {
  const CivicServices({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.featureId,
    this.fromYear,
    required this.id,
    required this.identityKind,
    this.institutionId,
    required this.kindTerm,
    this.providerId,
    this.scopeId,
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
  final SharedIdentityKind identityKind;
  final String? institutionId;
  final String kindTerm;
  final String? providerId;
  final String? scopeId;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory CivicServices.fromJson(Map<String, dynamic> json) => _$CivicServicesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicServicesToJson(this);
}
