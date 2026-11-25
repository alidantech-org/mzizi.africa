import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'countries.g.dart';

/// A modern country: facts only. Names are `identity.names`, regions are `identity.classifications`, its territory is the `geography.features` row sharing its identity.
@JsonSerializable(includeIfNull: false)
class ReferenceCountries {
  const ReferenceCountries({
    this.callingCode,
    required this.code,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.designationTerm,
    this.establishedOn,
    required this.id,
    required this.identityKind,
    this.isoAlpha2,
    this.isoAlpha3,
    this.isoNumeric,
    this.recognitionTerm,
    required this.updatedAt,
    required this.version,
  });
  final String? callingCode;
  final String code;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String? designationTerm;
  final DateTime? establishedOn;
  final String id;
  final SharedIdentityKind identityKind;
  final String? isoAlpha2;
  final String? isoAlpha3;
  final String? isoNumeric;
  final String? recognitionTerm;
  final DateTime updatedAt;
  final int version;

  factory ReferenceCountries.fromJson(Map<String, dynamic> json) => _$ReferenceCountriesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountriesToJson(this);
}
