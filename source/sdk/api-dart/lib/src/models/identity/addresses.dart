import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'addresses.g.dart';

/// Readable URL addresses of named things; dated rows keep old addresses resolving.
@JsonSerializable(includeIfNull: false)
class IdentityAddresses {
  const IdentityAddresses({
    this.canonicalId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    this.languageId,
    this.parentId,
    this.sectionTerm,
    required this.segment,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? canonicalId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final String? languageId;
  final String? parentId;
  final String? sectionTerm;
  final String segment;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory IdentityAddresses.fromJson(Map<String, dynamic> json) => _$IdentityAddressesFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityAddressesToJson(this);
}
