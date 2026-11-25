import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';

part 'name_match.g.dart';

/// Name Match
@JsonSerializable(includeIfNull: false)
class IdentityNameMatch {
  const IdentityNameMatch({
    required this.code,
    required this.identityId,
    required this.isDefault,
    required this.kind,
    required this.languageCode,
    required this.text,
  });
  final String code;
  final String identityId;
  final bool isDefault;
  final SharedIdentityKind kind;
  final String languageCode;
  final String text;

  factory IdentityNameMatch.fromJson(Map<String, dynamic> json) => _$IdentityNameMatchFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityNameMatchToJson(this);
}
