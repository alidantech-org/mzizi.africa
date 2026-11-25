import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'identifiers.g.dart';

/// Public identifiers of named things (ISO codes, IEBC codes, Wikidata ids, registration numbers). Personal identifiers such as national ID numbers are never stored.
@JsonSerializable(includeIfNull: false)
class IdentityIdentifiers {
  const IdentityIdentifiers({
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    required this.identityKind,
    this.issuerId,
    this.namespace,
    required this.schemeTerm,
    this.toYear,
    required this.updatedAt,
    required this.value,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final SharedIdentityKind identityKind;
  final String? issuerId;
  final String? namespace;
  final String schemeTerm;
  final int? toYear;
  final DateTime updatedAt;
  final String value;
  final int version;

  factory IdentityIdentifiers.fromJson(Map<String, dynamic> json) => _$IdentityIdentifiersFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityIdentifiersToJson(this);
}
