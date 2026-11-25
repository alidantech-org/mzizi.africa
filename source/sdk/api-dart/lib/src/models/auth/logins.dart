import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/login_kind.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/shared/identified.dart';

part 'logins.g.dart';

/// A way an account signs in: email or phone with one-time codes, or an OIDC issuer and subject.
@JsonSerializable(includeIfNull: false)
class AuthLogins {
  const AuthLogins({
    required this.accountId,
    required this.id,
    this.issuer,
    required this.kind,
    this.lastAuthenticatedAt,
    required this.linkedAt,
    this.subject,
    this.unlinkedAt,
    this.value,
    this.verifiedAt,
  });
  final String accountId;
  final String id;
  final String? issuer;
  final AuthLoginKind kind;
  final DateTime? lastAuthenticatedAt;
  final DateTime linkedAt;
  final String? subject;
  final DateTime? unlinkedAt;
  final String? value;
  final DateTime? verifiedAt;

  factory AuthLogins.fromJson(Map<String, dynamic> json) => _$AuthLoginsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthLoginsToJson(this);
}
