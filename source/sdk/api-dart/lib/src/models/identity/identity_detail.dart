import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identity_detail_identifiers.dart';
import 'package:mzizi_api/src/models/identity/identity_detail_names.dart';

part 'identity_detail.g.dart';

/// Identity Detail
@JsonSerializable(includeIfNull: false)
class IdentityIdentityDetail {
  const IdentityIdentityDetail({
    required this.code,
    required this.identifiers,
    required this.identityId,
    required this.kind,
    required this.names,
  });
  final String code;
  final List<IdentityIdentityDetailIdentifiers> identifiers;
  final String identityId;
  final SharedIdentityKind kind;
  final List<IdentityIdentityDetailNames> names;

  factory IdentityIdentityDetail.fromJson(Map<String, dynamic> json) => _$IdentityIdentityDetailFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityIdentityDetailToJson(this);
}
