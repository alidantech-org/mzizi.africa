import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/shared/identified.dart';

part 'login_identities.g.dart';

/// External issuer and subject linked to one account; unlinking is recorded, never deleted.
@JsonSerializable(includeIfNull: false)
class AuthLoginIdentities {
  const AuthLoginIdentities({
    required this.accountId,
    required this.id,
    required this.issuer,
    this.lastAuthenticatedAt,
    required this.linkedAt,
    required this.subject,
    this.unlinkedAt,
  });
  final String accountId;
  final String id;
  final String issuer;
  final DateTime? lastAuthenticatedAt;
  final DateTime linkedAt;
  final String subject;
  final DateTime? unlinkedAt;

  factory AuthLoginIdentities.fromJson(Map<String, dynamic> json) => _$AuthLoginIdentitiesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthLoginIdentitiesToJson(this);
}
