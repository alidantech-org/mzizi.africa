import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';

part 'address_match.g.dart';

/// Address Match
@JsonSerializable(includeIfNull: false)
class IdentityAddressMatch {
  const IdentityAddressMatch({
    required this.addressId,
    this.canonicalId,
    required this.code,
    required this.identityId,
    required this.kind,
    this.parentId,
    this.sectionTerm,
    this.toYear,
  });
  final String addressId;
  final String? canonicalId;
  final String code;
  final String identityId;
  final SharedIdentityKind kind;
  final String? parentId;
  final String? sectionTerm;
  final int? toYear;

  factory IdentityAddressMatch.fromJson(Map<String, dynamic> json) => _$IdentityAddressMatchFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityAddressMatchToJson(this);
}
