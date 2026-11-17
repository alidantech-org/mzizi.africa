import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/auth/scopes.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'delegations.g.dart';

/// Time-limited delegation of scoped access from one account to another.
@JsonSerializable(includeIfNull: false)
class AuthDelegations {
  const AuthDelegations({
    required this.createdAt,
    required this.delegateAccountId,
    required this.delegatorAccountId,
    this.expiresAt,
    required this.id,
    this.revokedAt,
    this.revokedBy,
    required this.scopeId,
    this.startsAt,
  });
  final DateTime createdAt;
  final String delegateAccountId;
  final String delegatorAccountId;
  final DateTime? expiresAt;
  final String id;
  final DateTime? revokedAt;
  final String? revokedBy;
  final String scopeId;
  final DateTime? startsAt;

  factory AuthDelegations.fromJson(Map<String, dynamic> json) => _$AuthDelegationsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthDelegationsToJson(this);
}
